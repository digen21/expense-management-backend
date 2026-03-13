import 'dotenv/config';
import bcrypt from 'bcrypt';
import {
  ExpenseCategory,
  ExpenseStatus,
  Prisma,
  PrismaClient,
  Role,
} from '@prisma/expense-tracker-client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash('Password@123', 10);

  const org = await prisma.organization.create({
    data: { name: 'Acme Corp' },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      password,
      role: Role.ADMIN,
      organizationId: org.id,
    },
  });

  const members = await prisma.user.createManyAndReturn({
    data: [
      {
        email: 'member1@acme.com',
        password,
        role: Role.USER,
        organizationId: org.id,
      },
      {
        email: 'member2@acme.com',
        password,
        role: Role.USER,
        organizationId: org.id,
      },
      {
        email: 'member3@acme.com',
        password,
        role: Role.USER,
        organizationId: org.id,
      },
    ],
  });

  const users = [admin, ...members];

  for (let i = 1; i <= 20; i++) {
    await prisma.expenses.create({
      data: {
        amount: new Prisma.Decimal(i * 10),
        category: Object.values(ExpenseCategory)[i % 5],
        status: Object.values(ExpenseStatus)[i % 4],
        description: `Expense ${i}`,
        date: new Date(),
        receiptUrl: `https://example.com/r${i}.png`,
        userId: users[i % users.length].id,
        organizationId: org.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
