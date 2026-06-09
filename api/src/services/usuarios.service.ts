import { prisma } from "../config/prisma";

export const UsuarioService = {
  async getAll() {
    return await prisma.usuario.findMany();
  },

  async getById(id: number) {
    return await prisma.usuario.findUnique({
      where: { Id: id },
    });
  },

};
