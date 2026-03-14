import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/expense-tracker-client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { type SafeUser } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/roles/roles.guard';
import ServerError from 'src/utils/ServerError';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateOrganizationInviteDto } from './dto/create-organization-invite.dto';
import { GetAllInvites } from './dto/get-all-invites.dto';
import { OrganizationInviteService } from './organization-invite.service';

@Controller('organization-invite')
export class OrganizationInviteController {
  constructor(
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @CurrentUser() user: SafeUser,
    @Body() createOrganizationInviteDto: CreateOrganizationInviteDto,
  ) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const existingInvite = await this.organizationInviteService.findUnique({
      where: {
        email_organizationId: {
          email: createOrganizationInviteDto.email,
          organizationId: user.organizationId!,
        },
      },
    });

    if (existingInvite?.accepted) {
      throw new ServerError({
        message: 'User already exists in the organization',
      });
    }

    if (existingInvite && existingInvite.expiresAt < new Date()) {
      return this.organizationInviteService.updateOne({
        where: { id: existingInvite.id, organizationId: user.organizationId! },
        data: {
          expiresAt,
          token: randomUUID(),
        },
      });
    }

    return await this.organizationInviteService.create({
      data: {
        ...createOrganizationInviteDto,
        token: randomUUID(),
        expiresAt,
        organizationId: user.organizationId!,
      },
    });

    // TODO can manage sending email here after invite created for the member user
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAll(@CurrentUser() user: SafeUser, @Query() query: GetAllInvites) {
    const { page = 1, limit = 10, ...filter } = query;

    const [invites, total] = await Promise.all([
      this.organizationInviteService.findAll({
        where: {
          ...filter,
          organizationId: user.organizationId!,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.organizationInviteService.count({
        where: {
          ...filter,
          organizationId: user.organizationId!,
        },
      }),
    ]);

    return {
      data: invites,
      total,
      page,
      limit,
    };
  }

  @Post('accept')
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.prisma.$transaction(async (tx) => {
      const invite = await tx.organizationInvite.findUnique({
        where: { token: dto.token },
      });

      if (!invite || invite.expiresAt < new Date()) {
        throw new ServerError({
          message: 'Invite expired or invalid',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }

      if (invite.accepted)
        throw new ServerError({
          message: 'Invite already been accepted',
          statusCode: HttpStatus.FORBIDDEN,
        });

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await tx.user.create({
        data: {
          email: invite.email,
          password: hashedPassword,
          role: invite.role,
          organizationId: invite.organizationId,
        },
        omit: {
          refreshToken: true,
          password: true,
        },
      });

      await tx.organizationInvite.update({
        where: { id: invite.id },
        data: { accepted: true },
      });

      return user;
    });
  }
}
