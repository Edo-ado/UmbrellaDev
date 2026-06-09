/*
  Warnings:

  - You are about to alter the column `Disponibilidad` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `usuario` MODIFY `Disponibilidad` BOOLEAN NULL;
