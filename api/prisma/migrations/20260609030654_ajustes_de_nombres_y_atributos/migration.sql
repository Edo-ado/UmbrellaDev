/*
  Warnings:

  - You are about to drop the column `estado` on the `categoria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cita` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `especialidad` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `servicio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `servicio` table. All the data in the column will be lost.
  - You are about to drop the column `Gmail` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `imagenesservicio` DROP FOREIGN KEY `imagenesServicio_idImagen_fkey`;

-- DropForeignKey
ALTER TABLE `imagenesservicio` DROP FOREIGN KEY `imagenesServicio_idServicio_fkey`;

-- DropForeignKey
ALTER TABLE `imagenesusuario` DROP FOREIGN KEY `imagenesUsuario_idImagen_fkey`;

-- DropForeignKey
ALTER TABLE `imagenesusuario` DROP FOREIGN KEY `imagenesUsuario_idUsuario_fkey`;

-- DropIndex
DROP INDEX `Usuario_Gmail_key` ON `usuario`;

-- AlterTable
ALTER TABLE `categoria` DROP COLUMN `estado`,
    ADD COLUMN `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO';

-- AlterTable
ALTER TABLE `cita` DROP COLUMN `updatedAt`,
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `especialidad` DROP COLUMN `estado`,
    ADD COLUMN `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO';

-- AlterTable
ALTER TABLE `imagenes` ADD COLUMN `Nombre` VARCHAR(191) NULL DEFAULT 'NoName',
    MODIFY `Url` VARCHAR(500) NOT NULL DEFAULT 'NoImage.url';

-- AlterTable
ALTER TABLE `imagenesservicio` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `imagenesusuario` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `servicio` DROP COLUMN `estado`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `Gmail`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `Email` VARCHAR(150) NOT NULL,
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_Email_key` ON `Usuario`(`Email`);

-- AddForeignKey
ALTER TABLE `ImagenesUsuario` ADD CONSTRAINT `ImagenesUsuario_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesUsuario` ADD CONSTRAINT `ImagenesUsuario_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesServicio` ADD CONSTRAINT `ImagenesServicio_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesServicio` ADD CONSTRAINT `ImagenesServicio_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
