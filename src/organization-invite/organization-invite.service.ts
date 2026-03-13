import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/expense-tracker-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationInviteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationInviteDto: Prisma.OrganizationInviteCreateArgs) {
    return this.prisma.organizationInvite.create(createOrganizationInviteDto);
  }

  findUnique(args: Prisma.OrganizationInviteFindUniqueArgs) {
    return this.prisma.organizationInvite.findUnique(args);
  }

  findAll(args: Prisma.OrganizationInviteFindManyArgs) {
    return this.prisma.organizationInvite.findMany(args);
  }

  count(args: Prisma.OrganizationInviteCountArgs) {
    return this.prisma.organizationInvite.count(args);
  }

  updateOne(args: Prisma.OrganizationInviteUpdateArgs) {
    return this.prisma.organizationInvite.update(args);
  }
}
