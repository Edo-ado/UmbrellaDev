-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nombreCompleto` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `edad` INTEGER NOT NULL,
    `lastLogin` DATETIME(3) NULL,
    `firstLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rol` ENUM('ADMIN', 'CLIENTE', 'DESARROLLADOR') NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL,
    `pais` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `id` VARCHAR(191) NOT NULL,
    `idCategoria` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesionales` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `aniosExperiencia` INTEGER NOT NULL,
    `ubicacion` VARCHAR(191) NULL,
    `fotoPerfil` VARCHAR(191) NOT NULL,
    `tituloProfesional` VARCHAR(191) NOT NULL,
    `modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'AMBAS') NULL,
    `tarifaBase` DECIMAL(65, 30) NOT NULL,
    `disponibilidad` BOOLEAN NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL,
    `lastLogin` DATETIME(3) NULL,
    `firstLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `universidadEgreso` VARCHAR(191) NULL,
    `cvOGithub` VARCHAR(191) NOT NULL,
    `edad` INTEGER NOT NULL,

    UNIQUE INDEX `profesionales_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` VARCHAR(191) NOT NULL,
    `idProfesional` VARCHAR(191) NOT NULL,
    `idCategoria` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precio` DECIMAL(65, 30) NOT NULL,
    `duracion` INTEGER NULL,
    `modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'AMBAS') NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL,
    `imagenReferencia` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_especialidades` (
    `idServicio` VARCHAR(191) NOT NULL,
    `idEspecialidad` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idServicio`, `idEspecialidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesional_especialidades` (
    `idProfesional` VARCHAR(191) NOT NULL,
    `idEspecialidad` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idProfesional`, `idEspecialidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `id` VARCHAR(191) NOT NULL,
    `idCliente` VARCHAR(191) NOT NULL,
    `idProfesional` VARCHAR(191) NOT NULL,
    `idServicio` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora` DATETIME(3) NOT NULL,
    `modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'AMBAS') NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagenes` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `especialidades` ADD CONSTRAINT `especialidades_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidades` ADD CONSTRAINT `servicio_especialidades_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidades` ADD CONSTRAINT `servicio_especialidades_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidades` ADD CONSTRAINT `profesional_especialidades_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidades` ADD CONSTRAINT `profesional_especialidades_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
