/*
  Warnings:

  - The values [CONFIRMADA,COMPLETADA] on the enum `HistorialEstadoCita_EstadoNuevo` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `FechaHoraFin` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `HoraFin` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Monto` to the `Cita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TiempoTotal` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cita` ADD COLUMN `FechaHoraFin` DATETIME(3) NOT NULL,
    ADD COLUMN `HoraFin` VARCHAR(10) NOT NULL,
    ADD COLUMN `Monto` DOUBLE NOT NULL,
    ADD COLUMN `MotivoCancelacion` VARCHAR(500) NULL,
    ADD COLUMN `MotivoRechazo` VARCHAR(500) NULL,
    ADD COLUMN `TiempoTotal` INTEGER NOT NULL,
    MODIFY `Estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETA') NOT NULL DEFAULT 'PENDIENTE';

-- CreateTable
CREATE TABLE `HistorialEstadoCita` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `EstadoAnterior` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETA') NOT NULL,
    `EstadoNuevo` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETA') NOT NULL,
    `Motivo` VARCHAR(500) NULL,
    `Fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `citaId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HistorialEstadoCita` ADD CONSTRAINT `HistorialEstadoCita_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `Cita`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
