-- CreateTable
CREATE TABLE `imagenesServicio` (
    `idImagen` INTEGER NOT NULL,
    `idServicio` INTEGER NOT NULL,

    PRIMARY KEY (`idImagen`, `idServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imagenesServicio` ADD CONSTRAINT `imagenesServicio_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imagenesServicio` ADD CONSTRAINT `imagenesServicio_idServicio_fkey` FOREIGN KEY (`idServicio`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
