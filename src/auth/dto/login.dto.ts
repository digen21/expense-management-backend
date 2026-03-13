import { Role, User } from '@prisma/expense-tracker-client';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Request } from 'express';
import { RegisterUserDto } from './register.dto';

export class LoginUserDto extends RegisterUserDto {
  @IsUUID()
  @IsOptional()
  organizationId?: string;
}

export type SafeUser = Omit<User, 'password'>;

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
};

export type AuthUserDto = Request & {
  userId: string;
  email: string;
  role: Role;
};

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export interface BaseJwtPayload {
  userId: string;
  role: Role;
}

export interface AccessTokenPayload extends BaseJwtPayload {
  type: 'access';
}

export interface RefreshTokenPayload extends BaseJwtPayload {
  type: 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
