/*
  Warnings:

  - Added the required column `Fecha` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Hora` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cita` ADD COLUMN `Fecha` DATETIME(3) NOT NULL,
    ADD COLUMN `Hora` VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE `imagenes` ADD COLUMN `resenaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Resena` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Puntuacion` INTEGER NOT NULL,
    `Comentario` VARCHAR(500) NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `citaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,

    UNIQUE INDEX `Resena_citaId_key`(`citaId`),
    INDEX `Resena_profesionalId_idx`(`profesionalId`),
    INDEX `Resena_clienteId_idx`(`clienteId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `Cita`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagenes` ADD CONSTRAINT `Imagenes_resenaId_fkey` FOREIGN KEY (`resenaId`) REFERENCES `Resena`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
