import { HttpStatus, Injectable } from '@nestjs/common';
import { ExpenseStatus } from '@prisma/expense-tracker-client';
import { ExpensesService } from 'src/expenses/expenses.service';
import { isValidExpenseTransition } from 'src/state-machine';
import ServerError from 'src/utils/ServerError';

@Injectable()
export class WebhooksService {
  constructor(private readonly expenseService: ExpensesService) {}

  async updateExpenseStatus(args: {
    expenseId: string;
    newStatus: ExpenseStatus;
    rejectionReason?: string;
  }) {
    const expense = await this.expenseService.findUnique({
      where: { id: args.expenseId },
    });

    if (!expense) {
      throw new ServerError({
        message: `Expense not found for id ${args.expenseId}`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (!isValidExpenseTransition(expense.status, args.newStatus)) {
      throw new ServerError({
        message: `Invalid state transition ${expense.status} -> ${args.newStatus}`,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    if (args.newStatus === ExpenseStatus.REJECTED && !args.rejectionReason) {
      throw new ServerError({
        message: 'Rejection reason required for REJECTED status',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    return this.expenseService.update({
      where: { id: args.expenseId },
      data: {
        status: args.newStatus,
        rejectionReason:
          args.newStatus === ExpenseStatus.REJECTED
            ? args.rejectionReason
            : null,
      },
    });
  }
}
