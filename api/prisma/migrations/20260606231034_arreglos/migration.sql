/*
  Warnings:

  - You are about to drop the `_cvtoprofesional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cv` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_cvtoprofesional` DROP FOREIGN KEY `_CVToProfesional_A_fkey`;

-- DropForeignKey
ALTER TABLE `_cvtoprofesional` DROP FOREIGN KEY `_CVToProfesional_B_fkey`;

-- DropTable
DROP TABLE `_cvtoprofesional`;

-- DropTable
DROP TABLE `cv`;

-- CreateTable
CREATE TABLE `Curriculum` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Url` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CurriculumToProfesional` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CurriculumToProfesional_AB_unique`(`A`, `B`),
    INDEX `_CurriculumToProfesional_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CurriculumToProfesional` ADD CONSTRAINT `_CurriculumToProfesional_A_fkey` FOREIGN KEY (`A`) REFERENCES `Curriculum`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CurriculumToProfesional` ADD CONSTRAINT `_CurriculumToProfesional_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
