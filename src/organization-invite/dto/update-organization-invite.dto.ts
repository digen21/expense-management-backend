import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationInviteDto } from './create-organization-invite.dto';

export class UpdateOrganizationInviteDto extends PartialType(
  CreateOrganizationInviteDto,
) {}
