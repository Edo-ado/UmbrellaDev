/*
  Warnings:

  - The primary key for the `imagenes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `imagenes` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `imagenes` table. All the data in the column will be lost.
  - The primary key for the `profesional_especialidades` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idProfesional` on the `profesional_especialidades` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idEspecialidad` on the `profesional_especialidades` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `citas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `especialidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profesionales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicio_especialidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Id` to the `Imagenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdProfesional` to the `Imagenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Url` to the `Imagenes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `citas` DROP FOREIGN KEY `citas_idCliente_fkey`;

-- DropForeignKey
ALTER TABLE `citas` DROP FOREIGN KEY `citas_idProfesional_fkey`;

-- DropForeignKey
ALTER TABLE `citas` DROP FOREIGN KEY `citas_idServicio_fkey`;

-- DropForeignKey
ALTER TABLE `especialidades` DROP FOREIGN KEY `especialidades_idCategoria_fkey`;

-- DropForeignKey
ALTER TABLE `profesional_especialidades` DROP FOREIGN KEY `profesional_especialidades_idEspecialidad_fkey`;

-- DropForeignKey
ALTER TABLE `profesional_especialidades` DROP FOREIGN KEY `profesional_especialidades_idProfesional_fkey`;

-- DropForeignKey
ALTER TABLE `servicio_especialidades` DROP FOREIGN KEY `servicio_especialidades_idEspecialidad_fkey`;

-- DropForeignKey
ALTER TABLE `servicio_especialidades` DROP FOREIGN KEY `servicio_especialidades_idServicio_fkey`;

-- DropForeignKey
ALTER TABLE `servicios` DROP FOREIGN KEY `servicios_idCategoria_fkey`;

-- DropForeignKey
ALTER TABLE `servicios` DROP FOREIGN KEY `servicios_idProfesional_fkey`;

-- DropIndex
DROP INDEX `profesional_especialidades_idEspecialidad_fkey` ON `profesional_especialidades`;

-- AlterTable
ALTER TABLE `imagenes` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `url`,
    ADD COLUMN `Id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `IdProfesional` INTEGER NOT NULL,
    ADD COLUMN `Url` VARCHAR(500) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `profesional_especialidades` DROP PRIMARY KEY,
    MODIFY `idProfesional` INTEGER NOT NULL,
    MODIFY `idEspecialidad` INTEGER NOT NULL,
    ADD PRIMARY KEY (`idProfesional`, `idEspecialidad`);

-- DropTable
DROP TABLE `categorias`;

-- DropTable
DROP TABLE `citas`;

-- DropTable
DROP TABLE `especialidades`;

-- DropTable
DROP TABLE `profesionales`;

-- DropTable
DROP TABLE `servicio_especialidades`;

-- DropTable
DROP TABLE `servicios`;

-- DropTable
DROP TABLE `usuarios`;

-- CreateTable
CREATE TABLE `Usuario` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreCompleto` VARCHAR(150) NOT NULL,
    `Gmail` VARCHAR(150) NOT NULL,
    `Contraseña` VARCHAR(150) NOT NULL,
    `Pais` VARCHAR(100) NOT NULL,
    `Edad` INTEGER NULL,
    `Role` ENUM('ADMIN', 'USUARIO', 'DESARROLLADOR') NOT NULL DEFAULT 'USUARIO',
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `LastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_Gmail_key`(`Gmail`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',

    UNIQUE INDEX `Categoria_Nombre_key`(`Nombre`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Especialidad` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `CategoriaId` INTEGER NOT NULL,

    UNIQUE INDEX `Especialidad_Nombre_key`(`Nombre`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `Precio` DOUBLE NOT NULL,
    `Duracion` INTEGER NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idprofesional` INTEGER NOT NULL,
    `idcategoria` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicioEspecialidad` (
    `idServicio` INTEGER NOT NULL,
    `idEspecialidad` INTEGER NOT NULL,

    PRIMARY KEY (`idServicio`, `idEspecialidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profesional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreCompleto` VARCHAR(150) NOT NULL,
    `Apellido` VARCHAR(150) NOT NULL,
    `Correo` VARCHAR(150) NOT NULL,
    `Contraseña` VARCHAR(150) NOT NULL,
    `Telefono` VARCHAR(20) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `AnosExperiencia` INTEGER NULL,
    `Ubicacion` VARCHAR(150) NULL,
    `FotoPerfil` VARCHAR(500) NULL,
    `TituloProfesional` VARCHAR(150) NULL,
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `TarifaBase` DOUBLE NULL,
    `Disponibilidad` VARCHAR(500) NULL,
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `Edad` INTEGER NULL,
    `Universidad` VARCHAR(150) NULL,
    `LastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Profesional_Correo_key`(`Correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cita` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Fecha` DATETIME(3) NOT NULL,
    `Hora` DATETIME(3) NOT NULL,
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `Descripcion` VARCHAR(500) NULL,
    `Comentarios` VARCHAR(500) NULL,
    `Estado` ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idcliente` INTEGER NOT NULL,
    `idservicio` INTEGER NOT NULL,
    `idprofesional` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pdf` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Url` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Especialidad` ADD CONSTRAINT `Especialidad_CategoriaId_fkey` FOREIGN KEY (`CategoriaId`) REFERENCES `Categoria`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idprofesional_fkey` FOREIGN KEY (`idprofesional`) REFERENCES `Profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idcategoria_fkey` FOREIGN KEY (`idcategoria`) REFERENCES `Categoria`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicioEspecialidad` ADD CONSTRAINT `ServicioEspecialidad_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicioEspecialidad` ADD CONSTRAINT `ServicioEspecialidad_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `Especialidad`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidades` ADD CONSTRAINT `profesional_especialidades_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `Profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidades` ADD CONSTRAINT `profesional_especialidades_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `Especialidad`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idcliente_fkey` FOREIGN KEY (`idcliente`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idservicio_fkey` FOREIGN KEY (`idservicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idprofesional_fkey` FOREIGN KEY (`idprofesional`) REFERENCES `Profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
