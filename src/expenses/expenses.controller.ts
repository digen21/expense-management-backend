import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpenseStatus, Role } from '@prisma/expense-tracker-client';
import { type SafeUser } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import transitionExpense from 'src/state-machine';
import ServerError from 'src/utils/ServerError';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GetAllInvites } from './dto/get-all-expenses.dto';
import {
  IdParamsDto,
  UpdateExpenseDto,
  UpdateExpenseStatusDto,
} from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(
    @CurrentUser() user: SafeUser,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return await this.expensesService.create({
      data: {
        ...createExpenseDto,
        userId: user.id,
        organizationId: user.organizationId!,
      },
    });
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentUser() user: SafeUser,
    @Param() param: IdParamsDto,
    @Body() updateExpenseStatusDto: UpdateExpenseStatusDto,
  ) {
    const baseWhere = {
      ...param,
      organizationId: user.organizationId!,
      userId: user.id,
    };

    const expense = await this.expensesService.findUnique({
      where: baseWhere,
    });

    if (!expense) {
      throw new ServerError({
        message: 'Expense not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const result = transitionExpense(
      expense.status,
      updateExpenseStatusDto.status,
      updateExpenseStatusDto.rejectionReason,
      user.role,
    );

    return await this.expensesService.update({
      where: baseWhere,
      data: {
        status: result.status,
        ...(result.rejectionReason && {
          rejectionReason: result.rejectionReason,
        }),
      },
    });
  }

  @Patch(':id')
  async updateExpense(
    @CurrentUser() user: SafeUser,
    @Param() param: IdParamsDto,
    @Body() updateExpenseStatusDto: UpdateExpenseDto,
  ) {
    const baseWhere = {
      id: param.id,
      userId: user.id,
      organizationId: user.organizationId!,
    };

    const expense = await this.expensesService.findUnique({
      where: {
        ...baseWhere,
        status: {
          in: [ExpenseStatus.DRAFT, ExpenseStatus.REJECTED],
        },
      },
    });

    if (!expense)
      throw new ServerError({
        message: `Expense not found for id ${param.id}`,
        statusCode: HttpStatus.NOT_FOUND,
      });

    return this.expensesService.update({
      where: baseWhere,
      data: updateExpenseStatusDto,
    });
  }

  @Get()
  async getExpenseList(
    @CurrentUser() user: SafeUser,
    @Query() query: GetAllInvites,
  ) {
    const { limit = 10, page = 1, ...filter } = query;

    const baseWhere = {
      ...filter,
      ...(user.role === Role.USER && { userId: user.id }),
      organizationId: user.organizationId!,
    };

    const [expenses, total] = await Promise.all([
      this.expensesService.find({
        where: baseWhere,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.expensesService.count({
        where: baseWhere,
      }),
    ]);

    return {
      data: expenses,
      total,
      page,
      limit,
    };
  }
}
