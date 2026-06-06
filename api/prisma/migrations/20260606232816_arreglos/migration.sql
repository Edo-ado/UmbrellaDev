/*
  Warnings:

  - You are about to drop the `_curriculumtoprofesional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_imagenestoprofesional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_curriculumtoprofesional` DROP FOREIGN KEY `_CurriculumToProfesional_A_fkey`;

-- DropForeignKey
ALTER TABLE `_curriculumtoprofesional` DROP FOREIGN KEY `_CurriculumToProfesional_B_fkey`;

-- DropForeignKey
ALTER TABLE `_imagenestoprofesional` DROP FOREIGN KEY `_ImagenesToProfesional_A_fkey`;

-- DropForeignKey
ALTER TABLE `_imagenestoprofesional` DROP FOREIGN KEY `_ImagenesToProfesional_B_fkey`;

-- DropTable
DROP TABLE `_curriculumtoprofesional`;

-- DropTable
DROP TABLE `_imagenestoprofesional`;
