import { Role } from '@prisma/expense-tracker-client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateOrganizationInviteDto {
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
