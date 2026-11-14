-- AlterTable
ALTER TABLE "usuario" ADD COLUMN "reset_token_hash" TEXT;
ALTER TABLE "usuario" ADD COLUMN "reset_token_expira_em" DATETIME;
