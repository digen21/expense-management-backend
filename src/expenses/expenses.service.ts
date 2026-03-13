import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/expense-tracker-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.ExpensesCreateArgs) {
    return this.prisma.expenses.create(args);
  }

  findUnique(args: Prisma.ExpensesFindUniqueArgs) {
    return this.prisma.expenses.findUnique(args);
  }

  find(args: Prisma.ExpensesFindManyArgs) {
    return this.prisma.expenses.findMany(args);
  }

  count(args: Prisma.ExpensesCountArgs) {
    return this.prisma.expenses.count(args);
  }

  update(args: Prisma.ExpensesUpdateArgs) {
    return this.prisma.expenses.update(args);
  }

  expenseReport(args: Prisma.monthly_expense_reportFindManyArgs) {
    return this.prisma.monthly_expense_report.findMany({
      orderBy: {},
      ...args,
    });
  }
}
