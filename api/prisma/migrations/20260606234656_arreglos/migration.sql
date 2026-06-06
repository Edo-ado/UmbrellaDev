/*
  Warnings:

  - You are about to drop the column `Nombre` on the `curriculum` table. All the data in the column will be lost.
  - You are about to drop the column `IdProfesional` on the `imagenes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `curriculum` DROP COLUMN `Nombre`;

-- AlterTable
ALTER TABLE `imagenes` DROP COLUMN `IdProfesional`;
