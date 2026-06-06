-- CreateTable
CREATE TABLE `curriculumProfesional` (
    `idCurriculum` INTEGER NOT NULL,
    `idProfesional` INTEGER NOT NULL,

    PRIMARY KEY (`idCurriculum`, `idProfesional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagenesProfesional` (
    `idImagen` INTEGER NOT NULL,
    `idProfesional` INTEGER NOT NULL,

    PRIMARY KEY (`idImagen`, `idProfesional`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `curriculumProfesional` ADD CONSTRAINT `curriculumProfesional_idCurriculum_fkey` FOREIGN KEY (`idCurriculum`) REFERENCES `Curriculum`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curriculumProfesional` ADD CONSTRAINT `curriculumProfesional_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `Profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imagenesProfesional` ADD CONSTRAINT `imagenesProfesional_idImagen_fkey` FOREIGN KEY (`idImagen`) REFERENCES `Imagenes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imagenesProfesional` ADD CONSTRAINT `imagenesProfesional_idProfesional_fkey` FOREIGN KEY (`idProfesional`) REFERENCES `Profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
