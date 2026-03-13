<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Database schema

- `organizations`: organizations/tenants. Fields: `id`, `name`, timestamps. One-to-many with `users`, `expenses`, `organization_invite`.
- `users`: members/admins. Fields: `id`, `email`, `password`, `role`, `organization_id`, `refresh_token`, timestamps. Unique `(email, organization_id)`.
- `organization_invite`: invites to join an organization. Fields: `id`, `email`, `organization_id`, `role`, `token`, `expires_at`, `accepted`, timestamps.
- `expenses`: expense records. Fields: `id`, `amount`, `category`, `description`, `date`, `receipt_url`, `status`, `rejection_reason`, `user_id`, `organization_id`, timestamps. Indexed by `organization_id`, `user_id`, `status`.
- `monthly_expense_report` (view): aggregated monthly report per org/month with JSON fields: `total_expenses`, `top_spenders`, `status_counts`.

Enums:

- `Role`: `ADMIN`, `USER`
- `ExpenseStatus`: `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`
- `ExpenseCategory`: `TRAVEL`, `FOOD`, `SOFTWARE`, `OFFICE_SUPPLIES`, `OTHER`

## API endpoints

- `GET /api` — Health check — Auth: None
- `POST /api/auth/register` — Register user — Auth: None
- `POST /api/auth/login` — Login — Auth: None
- `GET /api/auth/profile` — Get current user — Auth: JWT
- `POST /api/auth/refresh` — Refresh access token — Auth: Access token + refresh token
- `POST /api/organization` — Create organization — Auth: JWT (Admin)
- `GET /api/organization` — Get organization — Auth: JWT
- `POST /api/organization-invite` — Create invite — Auth: JWT (Admin)
- `GET /api/organization-invite` — List invites — Auth: JWT (Admin)
- `POST /api/organization-invite/accept` — Accept invite — Auth: None
- `GET /api/users` — List users — Auth: JWT
- `POST /api/expenses` — Create expense — Auth: JWT
- `PATCH /api/expenses/:id/status` — Update expense status — Auth: JWT
- `PATCH /api/expenses/:id` — Update expense details — Auth: JWT
- `GET /api/expenses` — List expenses — Auth: JWT
- `POST /api/webhooks/expense-status` — Webhook update status — Auth: `x-webhook-secret` header
- `GET /api/reports/monthly-summary` — Monthly report — Auth: JWT (Admin)

## Project setup

```bash
$ git clone https://github.com/digen21/expense-management-backend.git
$ cd expense-management-backend
$ yarn install
$ cp .env.example .env
$ yarn run prisma:migrate
$ yarn run prisma:seed
$ yarn run start:dev
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
