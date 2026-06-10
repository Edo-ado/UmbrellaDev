import {  MODALIDAD, Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

export const UsuarioService = {
  async getAll() {
    return await prisma.usuario.findMany({ include: { especialidades: true } });
  },

  async getById(id: number) {
    return await prisma.usuario.findUnique({
      where: { Id: id },
      include: { especialidades: true },
    });
  },

  async getByRol(Role: Role) {
    return await prisma.usuario.findMany({
      where: { Role: Role },
      include: { especialidades: true },
    });
  },

  async getByModalidad(modalidad: MODALIDAD) {
    return await prisma.usuario.findMany({
      where: { Modalidad: modalidad },
      include: { especialidades: true },
    });
  },

  async getByDisponibilidad(Disponibilidad: boolean) {
    return await prisma.usuario.findMany({
      where: { Disponibilidad: Disponibilidad },
      include: { especialidades: true },
    });
  },

  async toggleStatus(Id: Number) {}, //por hacer

  async create(/*Mucha vaina*/) {}, //por hacer

   async update(/*Mucha vaina*/) {}, //por hacer
};
