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

<<<<<<< HEAD
  async toggleStatus(Id: number) {}, //por hacer
=======
  async toggleStatus(id: number) {
const especialidad = await this.getById(id);

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
>>>>>>> origin
};
