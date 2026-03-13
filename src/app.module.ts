import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { transformAndValidateSync } from 'class-transformer-validator';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { OrganizationInviteModule } from './organization-invite/organization-invite.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { EnvConfig } from './validators/env.validators';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';

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
    OrganizationInviteModule,
    WebhooksModule,
    ReportsModule,
  ],
  controllers: [AppController, ReportsController],
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
