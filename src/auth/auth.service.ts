import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Role } from '@prisma/expense-tracker-client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPair,
} from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    protected prisma: PrismaService,
    protected userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId: string, role: Role): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, role, type: 'access' },
        {
          expiresIn: '1h',
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        },
      ),

      this.jwtService.signAsync(
        { userId, role, type: 'refresh' },
        {
          expiresIn: '7d',
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    await this.userService.updateOne({
      data: {
        refreshToken,
      },
      where: {
        id: userId,
        role,
      },
    });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(payload: AccessTokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId, role: payload.role },
      omit: { password: true, refreshToken: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async refreshAccessToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<TokenPair> {
    try {
      try {
        await this.jwtService.verifyAsync(accessToken, {
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        });
        throw new UnauthorizedException('Access token not expired');
      } catch (err) {
        if (!(err instanceof TokenExpiredError)) throw err;
      }

      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.role);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) throw error;

      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
