import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/expense-tracker-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.UserCreateArgs) {
    return this.prisma.user.create(args);
  }

  findOne(args: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(args);
  }

  updateOne(args: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args);
  }
}
