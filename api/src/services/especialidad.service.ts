import { Estado } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

export const EspecialidadService = {
  async getAll() {
    return await prisma.especialidad.findMany({
      include: { CategoriaAsociada: true },
      omit: { CategoriaId: true },
    });
  },

  async getById(id: number) {
    return await prisma.especialidad.findUnique({
      where: { Id: id },
      include: { CategoriaAsociada: true },
      omit: { CategoriaId: true },
    });
  },

  async getByName(Nombre: string) {
    return await prisma.especialidad.findMany({
      where: { Nombre: { contains: Nombre } },
      include: { CategoriaAsociada: true },
      omit: { CategoriaId: true },
    });
  },

  async getByEstado(Estado: Estado) {
    return await prisma.especialidad.findMany({
      where: { Estado: Estado },
      include: { CategoriaAsociada: true },
      omit: { CategoriaId: true },
    });
  },

  async toggleStatus(Id: number) {}, //por hacer
};
