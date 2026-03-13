/*
  Warnings:

  - A unique constraint covering the columns `[email,organization_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- CreateTable
CREATE TABLE "organization_invite" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "organization_id" UUID NOT NULL,
    "role" "Role" NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_invite_token_key" ON "organization_invite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "organization_invite_email_organization_id_key" ON "organization_invite"("email", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_organization_id_key" ON "users"("email", "organization_id");

-- AddForeignKey
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
