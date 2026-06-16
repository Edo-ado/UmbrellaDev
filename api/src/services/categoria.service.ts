import { Estado, ESTADOCITA } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

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

  async getById(id: number) {
    return await prisma.categoria.findUnique({
      where: { Id: id },
      include: {
        especialidad: {
          omit: { Estado: true, Descripcion: true, CategoriaId: true },
        },
      },
    });
  },

  async getByName(Nombre: string) {
    return await prisma.categoria.findMany({
      where: { Nombre: { contains: Nombre } },
      include: {
        especialidad: {
          omit: { Estado: true, Descripcion: true, CategoriaId: true },
        },
      },
    });
  },

  async getByEstado(Estado: Estado) {
    return await prisma.categoria.findMany({
      where: { Estado: Estado },
      include: {
        especialidad: {
          omit: { Estado: true, Descripcion: true, CategoriaId: true },
        },
      },
    });
  },

<<<<<<< HEAD
  async toggleStatus(Id: number) {}, //por hacer
=======
  async toggleStatus(id: number) {


const categoria = await this.getById(id);

 let nuevoEstado: Estado;

  if (categoria?.Estado === "ACTIVO") {
    nuevoEstado = "INACTIVO";
  } else {
    nuevoEstado = "ACTIVO";
  }

return await prisma.categoria.update({
    where: { Id: id },
    data: {
      Estado: nuevoEstado
    }
  });




  }, 

  
>>>>>>> origin
};
