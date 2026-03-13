import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/expense-tracker-client';
import { type SafeUser } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersService } from 'src/users/users.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @CurrentUser() user: SafeUser,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: createOrganizationDto,
      });

      await tx.user.update({
        where: {
          id: user.id,
          role: user.role,
        },
        data: {
          organizationId: organization.id,
        },
      });

      return organization;
    });
  }

  @Get()
  @UseGuards(RolesGuard)
  async get(@CurrentUser() user: SafeUser) {
    return await this.organizationService.findUnique({
      where: {
        id: user.organizationId!,
      },
    });
  }
}
