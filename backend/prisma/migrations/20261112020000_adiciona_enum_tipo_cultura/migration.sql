-- Migration: adiciona_enum_tipo_cultura
-- Alinha Plantacao.tipo ao enum tipoCultura usado no frontend.
-- SQLite armazena enums como TEXT; a validação fica a cargo do Prisma/Zod.

UPDATE "plantacao" SET "tipo" = 'Feijao' WHERE "tipo" = 'Feijão';
UPDATE "plantacao" SET "tipo" = 'Abobora' WHERE "tipo" = 'Abóbora';
UPDATE "plantacao" SET "tipo" = 'Rucula' WHERE "tipo" = 'Rúcula';
