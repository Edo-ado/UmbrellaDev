import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const ResenaService = {


  async getAll() {},

  async getById(id: number) {},

  async getDetailById(id: number) {},

  //validaciones grandes
  async EsUnicaResena(idUsuario: number, IdCita: number) {},

  async ValidarCalificacion(calificacion: number) {},

  async EsCitaCompletada(IdCita: number) {},

  async AgregarResena(resena: any) {},

  async promedioCalificacionPorProfesional(idProfesional: number) {},

  
};
