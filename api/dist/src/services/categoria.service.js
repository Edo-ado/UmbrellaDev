import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
export const CategoriaService = {
    async getAll() {
        return await prisma.categoria.findMany({
            include: {
                especialidad: {
                    omit: { Estado: true, Descripcion: true, CategoriaId: true },
                },
            },
        });
    },
    async getById(id) {
        return await prisma.categoria.findUnique({
            where: { Id: id },
            include: {
                especialidad: {
                    omit: { Estado: true, Descripcion: true, CategoriaId: true },
                },
            },
        });
    },
    async getByName(Nombre) {
        return await prisma.categoria.findMany({
            where: { Nombre: { contains: Nombre } },
            include: {
                especialidad: {
                    omit: { Estado: true, Descripcion: true, CategoriaId: true },
                },
            },
        });
    },
    async getByEstado(Estado) {
        return await prisma.categoria.findMany({
            where: { Estado: Estado },
            include: {
                especialidad: {
                    omit: { Estado: true, Descripcion: true, CategoriaId: true },
                },
            },
        });
    },
    async toggleStatus(id) {
        const categoria = await this.getById(id);
        if (!categoria) {
            throw AppError.badRequest("La categoría indicada no existe");
        }
        let nuevoEstado;
        if (categoria?.Estado === "ACTIVO") {
            nuevoEstado = "INACTIVO";
        }
        else {
            nuevoEstado = "ACTIVO";
        }
        return await prisma.categoria.update({
            where: { Id: id },
            data: {
                Estado: nuevoEstado
            }
        });
    },
};
