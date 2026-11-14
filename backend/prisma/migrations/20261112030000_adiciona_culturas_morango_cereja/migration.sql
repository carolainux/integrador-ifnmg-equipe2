-- Migration: adiciona_culturas_morango_cereja
-- Adiciona Morango e Cereja ao enum tipoCultura e atualiza as plantações do seed.

UPDATE "plantacao" SET "tipo" = 'Morango' WHERE "tipo" = 'Fruticultura' AND "nome" LIKE '%Morango%';
UPDATE "plantacao" SET "tipo" = 'Cereja' WHERE "tipo" = 'Fruticultura' AND "nome" LIKE '%Cereja%';
