import { prisma } from "../config/prisma";

export const CategoriaService = {
  async getAll() {
    return await prisma.categoria.findMany({include: {especialidad :  {
      omit: { Estado: true, Descripcion : true, CategoriaId: true  }
    } } });
  },


  
  async getById(id: number) {
    return await prisma.categoria.findUnique({
      where: { Id: id },include: {especialidad :  {
        omit: { Estado: true, Descripcion : true, CategoriaId: true  }
      } } }) ;
    },
    };
  



