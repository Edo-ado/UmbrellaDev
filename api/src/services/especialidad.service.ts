import { prisma } from "../config/prisma";

export const EspecialidadService = {
  async getAll() {
    return await prisma.especialidad.findMany({  include: {CategoriaAsociada :true },omit: { CategoriaId: true } });
  },

  async getById(id: number) {
    return await prisma.especialidad.findUnique({
      where: { Id: id }, include: {CategoriaAsociada :true }, omit: { CategoriaId: true }}) ;
  },

};
