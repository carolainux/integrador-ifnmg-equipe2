-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_token_hash" TEXT,
    "reset_token_expira_em" DATETIME,
    "notif_temperatura" BOOLEAN NOT NULL DEFAULT true,
    "notif_umidade_solo" BOOLEAN NOT NULL DEFAULT true,
    "notif_umidade_ar" BOOLEAN NOT NULL DEFAULT true,
    "notif_luminosidade" BOOLEAN NOT NULL DEFAULT true,
    "notif_sensor_offline" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_usuario" ("criado_em", "email", "id", "nome", "reset_token_expira_em", "reset_token_hash", "senha", "telefone") SELECT "criado_em", "email", "id", "nome", "reset_token_expira_em", "reset_token_hash", "senha", "telefone" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
CREATE UNIQUE INDEX "usuario_telefone_key" ON "usuario"("telefone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
