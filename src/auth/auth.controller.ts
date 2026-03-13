import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/expense-tracker-client';
import bcrypt from 'bcrypt';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import ServerError from 'src/utils/ServerError';
import { AuthService } from './auth.service';
import {
  type AuthUserDto,
  LoginResponse,
  LoginUserDto,
  RefreshTokenDto,
  SafeUser,
} from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<SafeUser> {
    const { email, password, role } = registerUserDto;

    const user = await this.usersService.findOne({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (user)
      throw new ServerError({
        message: 'User Already Exists...',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    const hashPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({
      data: {
        email,
        password: hashPassword,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: role ?? Role.USER,
      },
      omit: {
        password: true,
      },
    });
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findOne({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      omit: {
        refreshToken: true,
      },
    });

    if (!user) {
      throw new ServerError({
        message: 'Invalid Credential',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ServerError({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const tokens = await this.authService.generateTokens(user.id, user.role);

    return {
      ...tokens,
      user,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  profile(@CurrentUser() user: AuthUserDto) {
    return user;
  }

  @Post('refresh')
  async refreshToken(
    @Headers('authorization') auth: string,
    @Body() dto: RefreshTokenDto,
  ) {
    const accessToken = auth?.replace('Bearer ', '');
    console.log('accessToken :: ', accessToken);

    return this.authService.refreshAccessToken(accessToken, dto.refreshToken);
  }
}
