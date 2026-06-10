import { Estado, MODALIDAD, Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

export const ServicioServices = {
  async getAll() {
    return await prisma.servicio.findMany({
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.servicio.findUnique({
      where: { Id: id },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByProfesional(profesionalId: number) {
    return await prisma.servicio.findMany({
      where: { idprofesional: profesionalId },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByCategories(CategoriesID: number) {
    return await prisma.servicio.findMany({
      where: { idcategoria: CategoriesID },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByModalidad(modalidad: MODALIDAD) {
    return await prisma.servicio.findMany({
      where: { Modalidad: modalidad },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByRangoPrecio(precioMin: number, precioMax: number) {
    return await prisma.servicio.findMany({
      where: {
        Precio: {
          gte: precioMin,
          lte: precioMax,
        },
      },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },
};
