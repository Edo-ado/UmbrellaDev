/*
  Warnings:

  - You are about to drop the `pdf` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `pdf`;

-- CreateTable
CREATE TABLE `CV` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Url` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ImagenesToProfesional` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ImagenesToProfesional_AB_unique`(`A`, `B`),
    INDEX `_ImagenesToProfesional_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CVToProfesional` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CVToProfesional_AB_unique`(`A`, `B`),
    INDEX `_CVToProfesional_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ImagenesToProfesional` ADD CONSTRAINT `_ImagenesToProfesional_A_fkey` FOREIGN KEY (`A`) REFERENCES `Imagenes`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ImagenesToProfesional` ADD CONSTRAINT `_ImagenesToProfesional_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CVToProfesional` ADD CONSTRAINT `_CVToProfesional_A_fkey` FOREIGN KEY (`A`) REFERENCES `CV`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CVToProfesional` ADD CONSTRAINT `_CVToProfesional_B_fkey` FOREIGN KEY (`B`) REFERENCES `Profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
