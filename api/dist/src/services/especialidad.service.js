import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
export const EspecialidadService = {
    async getAll() {
        return await prisma.especialidad.findMany({
            include: { CategoriaAsociada: true },
            omit: { CategoriaId: true },
        });
    },
    async getById(id) {
        return await prisma.especialidad.findUnique({
            where: { Id: id },
            include: { CategoriaAsociada: true },
            omit: { CategoriaId: true },
        });
    },
    
    async GetMyEspecialidades(id) {
        return await prisma.especialidad.findMany({
            where: { CategoriaId: id },
            include: { CategoriaAsociada: true },
            omit: { CategoriaId: true },
        });
    },

    async getByName(Nombre) {
        return await prisma.especialidad.findMany({
            where: { Nombre: { contains: Nombre } },
            include: { CategoriaAsociada: true },
            omit: { CategoriaId: true },
        });
    },
    async getByEstado(Estado) {
        return await prisma.especialidad.findMany({
            where: { Estado: Estado },
            include: { CategoriaAsociada: true },
            omit: { CategoriaId: true },
        });
    },
    async toggleStatus(id) {
        const especialidad = await this.getById(id);
        if (!especialidad) {
            throw AppError.badRequest("La especialidad indicada no existe");
        }
        let nuevoEstado;
        if (especialidad?.Estado === "ACTIVO") {
            nuevoEstado = "INACTIVO";
        }
        else {
            nuevoEstado = "ACTIVO";
        }
        return await prisma.especialidad.update({
            where: { Id: id },
            data: {
                Estado: nuevoEstado
            }
        });
    },
};
