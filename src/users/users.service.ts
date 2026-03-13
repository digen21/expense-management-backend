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

  findMany(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }

  count(args?: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }

  updateOne(args: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args);
  }
}
