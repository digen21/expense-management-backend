import { Role } from '@prisma/expense-tracker-client/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetAllUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;
}

export class GetUserDto {
  @IsString()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsUUID()
  organizationId: string;
}
