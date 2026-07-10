-- CreateTable
CREATE TABLE `Usuario` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `NombreCompleto` VARCHAR(150) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `Contrasena` VARCHAR(150) NOT NULL,
    `Pais` VARCHAR(100) NOT NULL,
    `Edad` INTEGER NULL,
    `Telefono` VARCHAR(20) NULL,
    `Role` ENUM('ADMIN', 'USUARIO', 'DESARROLLADOR') NOT NULL DEFAULT 'USUARIO',
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `Descripcion` VARCHAR(500) NULL,
    `AnosExperiencia` INTEGER NULL,
    `Ubicacion` VARCHAR(150) NULL,
    `TituloProfesional` VARCHAR(150) NULL,
    `TarifaBase` DOUBLE NULL,
    `Disponibilidad` BOOLEAN NULL,
    `Universidad` VARCHAR(150) NULL,
    `LastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_Email_key`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',

    UNIQUE INDEX `Categoria_Nombre_key`(`Nombre`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Especialidad` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(150) NOT NULL,
    `Descripcion` VARCHAR(500) NULL,
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
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
    `Estado` ENUM('ACTIVO', 'INACTIVO', 'BANEADO') NOT NULL DEFAULT 'ACTIVO',
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idprofesional` INTEGER NOT NULL,
    `idcategoria` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cita` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaHora` DATETIME(3) NOT NULL,
    `Fecha` DATETIME(3) NOT NULL,
    `Hora` VARCHAR(10) NOT NULL,
    `Modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HIBRIDA') NOT NULL DEFAULT 'PRESENCIAL',
    `Descripcion` VARCHAR(500) NULL,
    `Comentarios` VARCHAR(500) NULL,
    `Estado` ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idcliente` INTEGER NOT NULL,
    `idprofesional` INTEGER NOT NULL,
    `idservicio` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Imagenes` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NULL DEFAULT 'NoName',
    `Url` VARCHAR(500) NOT NULL DEFAULT 'NoImage.url',
    `resenaId` INTEGER NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curriculum` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Url` VARCHAR(500) NOT NULL,
    `UsuarioID` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenesUsuario` (
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idImagen` INTEGER NOT NULL,
    `idUsuario` INTEGER NOT NULL,

    PRIMARY KEY (`idImagen`, `idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenesServicio` (
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idImagen` INTEGER NOT NULL,
    `idServicio` INTEGER NOT NULL,

    PRIMARY KEY (`idImagen`, `idServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EspecialidadToServicio` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EspecialidadToServicio_AB_unique`(`A`, `B`),
    INDEX `_EspecialidadToServicio_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EspecialidadToUsuario` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EspecialidadToUsuario_AB_unique`(`A`, `B`),
    INDEX `_EspecialidadToUsuario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Especialidad` ADD CONSTRAINT `Especialidad_CategoriaId_fkey` FOREIGN KEY (`CategoriaId`) REFERENCES `Categoria`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idprofesional_fkey` FOREIGN KEY (`idprofesional`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_idcategoria_fkey` FOREIGN KEY (`idcategoria`) REFERENCES `Categoria`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idcliente_fkey` FOREIGN KEY (`idcliente`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idprofesional_fkey` FOREIGN KEY (`idprofesional`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_idservicio_fkey` FOREIGN KEY (`idservicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `Cita`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resena` ADD CONSTRAINT `Resena_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagenes` ADD CONSTRAINT `Imagenes_resenaId_fkey` FOREIGN KEY (`resenaId`) REFERENCES `Resena`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curriculum` ADD CONSTRAINT `Curriculum_UsuarioID_fkey` FOREIGN KEY (`UsuarioID`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesUsuario` ADD CONSTRAINT `ImagenesUsuario_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesUsuario` ADD CONSTRAINT `ImagenesUsuario_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesServicio` ADD CONSTRAINT `ImagenesServicio_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesServicio` ADD CONSTRAINT `ImagenesServicio_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToServicio` ADD CONSTRAINT `_EspecialidadToServicio_A_fkey` FOREIGN KEY (`A`) REFERENCES `Especialidad`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToServicio` ADD CONSTRAINT `_EspecialidadToServicio_B_fkey` FOREIGN KEY (`B`) REFERENCES `Servicio`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToUsuario` ADD CONSTRAINT `_EspecialidadToUsuario_A_fkey` FOREIGN KEY (`A`) REFERENCES `Especialidad`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToUsuario` ADD CONSTRAINT `_EspecialidadToUsuario_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
