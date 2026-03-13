import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { transformAndValidateSync } from 'class-transformer-validator';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { EnvConfig } from './validators/env.validators';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    OrganizationModule,
    UsersModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: EnvConfig,
      useValue: transformAndValidateSync(EnvConfig, process.env, {
        validator: { whitelist: true },
      }),
    },
    PrismaService,
  ],
})
export class AppModule {}
