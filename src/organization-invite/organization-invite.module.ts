import { Module } from '@nestjs/common';
import { OrganizationInviteController } from './organization-invite.controller';
import { OrganizationInviteService } from './organization-invite.service';

@Module({
  imports: [],
  controllers: [OrganizationInviteController],
  providers: [OrganizationInviteService],
  exports: [OrganizationInviteService],
})
export class OrganizationInviteModule {}
