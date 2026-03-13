import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/expense-tracker-client';
import { type SafeUser } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { MonthlyReportDto } from 'src/expenses/dto/month-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles(Role.ADMIN)
  @Get('monthly-summary')
  async getMonthlyExpenseReport(
    @CurrentUser() user: SafeUser,
    @Query() monthlyReportDto: MonthlyReportDto,
  ) {
    const monthDate = new Date(`${monthlyReportDto.month}-01`);

    return await this.prisma.monthly_expense_report.findMany({
      where: {
        organization_id: user.organizationId,
        month: {
          gte: monthDate,
          lt: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1),
        },
      },
    });
  }
}
