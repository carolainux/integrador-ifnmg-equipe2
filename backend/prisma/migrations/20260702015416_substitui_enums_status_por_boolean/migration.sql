/*
  Warnings:

  - You are about to alter the column `status` on the `dispositivo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.
  - You are about to alter the column `status` on the `sensor` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dispositivo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_dispositivo" ("criado_em", "id", "nome", "status", "tipo") SELECT "criado_em", "id", "nome", "status", "tipo" FROM "dispositivo";
DROP TABLE "dispositivo";
ALTER TABLE "new_dispositivo" RENAME TO "dispositivo";
CREATE TABLE "new_sensor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "direcao" TEXT NOT NULL DEFAULT 'ABAIXO',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_sensor" ("criado_em", "direcao", "id", "nome", "status", "tipo", "unidade") SELECT "criado_em", "direcao", "id", "nome", "status", "tipo", "unidade" FROM "sensor";
DROP TABLE "sensor";
ALTER TABLE "new_sensor" RENAME TO "sensor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
