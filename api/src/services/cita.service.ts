import { ESTADOCITA } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

export const CitaServices = {
  async getAll() {
    return await prisma.cita.findMany({
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.cita.findUnique({
      where: { Id: id },
    });
  },

  async getByProfesional(profesionalId: number) {
    return await prisma.cita.findMany({
      where: { idprofesional: profesionalId },
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
      },
    });
  },

  async getByStatus(EstadoCita: ESTADOCITA) {
    return await prisma.cita.findMany({
      where: { Estado: EstadoCita },
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
      },
    });
  },

  async getByFechas(DiaInicial: Date, DiaFinal: Date) {
    return await prisma.cita.findMany({
      where: {
        fechaHora: {
          gte: DiaInicial,
          lte: DiaFinal,
        },
      },
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
      },
    });
  },

  async toggleStatus() {}, //por hacer

  async create() {}, //por hacer

  async update() {}, //por hacer
};
