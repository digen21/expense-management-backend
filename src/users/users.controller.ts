import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/expense-tracker-client';
import { type SafeUser } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@CurrentUser() user: SafeUser, @Query() query: GetAllUserDto) {
    const { page = 1, limit = 10 } = query;

    const baseWhere = {
      organizationId: user.organizationId,
      role: {
        not: {
          equals: Role.ADMIN,
        },
      },
    };

    const [users, total] = await Promise.all([
      this.usersService.findMany({
        where: baseWhere,
        omit: {
          password: true,
          refreshToken: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.usersService.count({
        where: baseWhere,
      }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
    };
  }
}
