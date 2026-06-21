import { Estado } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

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

  async toggleStatus(id: number) {
const especialidad = await this.getById(id);

if (!especialidad) {
    throw AppError.badRequest("La especialidad indicada no existe");
  }
  

 let nuevoEstado: Estado;

  if (especialidad?.Estado === "ACTIVO") {
    nuevoEstado = "INACTIVO";
  } else {
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
