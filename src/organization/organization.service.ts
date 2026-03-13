import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/expense-tracker-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.OrganizationCreateArgs) {
    return this.prisma.organization.create(args);
  }

  findUnique(args: Prisma.OrganizationFindUniqueArgs) {
    return this.prisma.organization.findUnique(args);
  }
}
