import { ESTADOCITA } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

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
      Fecha: {
        gte: DiaInicial,
        lte: DiaFinal,
      },
    },
    include: {
      cliente: true,
      profesional: true,
      servicio: true,
    }
  });
},

async toggleStatus(id: number) {
  const cita = await this.getById(id);

  let nuevoEstado: ESTADOCITA;

  if (cita?.Estado === "PENDIENTE") {
    nuevoEstado = "CONFIRMADA";
  } else {
    nuevoEstado = "PENDIENTE";
  }

  return await prisma.cita.update({
    where: { Id: id },
    data: {
      Estado: nuevoEstado,
    },
  });
},

async create(data: any) {

    if (!data.idcliente) {
      throw AppError.badRequest("El cliente es obligatorio");
    }

    if (!data.idprofesional) {
      throw AppError.badRequest("El profesional es obligatorio");
    }

    if (!data.idservicio) {
      throw AppError.badRequest("El servicio es obligatorio");
    }

    if (!data.Fecha) {
      throw AppError.badRequest("La fecha es obligatoria");
    }

    if (!data.Hora || data.Hora.trim() === "") {
      throw AppError.badRequest("La hora es obligatoria");
    }

    if (!data.Modalidad) {
      throw AppError.badRequest("La modalidad es obligatoria");
    }

    if (!data.Descripcion || data.Descripcion.trim() === "") {
      throw AppError.badRequest("La descripción es obligatoria");
    }

    const clienteExiste = await prisma.usuario.findUnique({
      where: { Id: data.idcliente },
    });

    if (!clienteExiste) {
      throw AppError.badRequest("El cliente indicado no existe");
    }

    const profesionalExiste = await prisma.usuario.findUnique({
      where: { Id: data.idprofesional },
    });

    if (!profesionalExiste) {
      throw AppError.badRequest("El profesional indicado no existe");
    }

    const servicioExiste = await prisma.servicio.findUnique({
      where: { Id: data.idservicio },
    });

    if (!servicioExiste) {
      throw AppError.badRequest("El servicio indicado no existe");
    }

    const fechaHora = new Date(`${data.Fecha}T${data.Hora}:00`);

    return await prisma.cita.create({
      data: {
        idcliente: data.idcliente,
        idprofesional: data.idprofesional,
        idservicio: data.idservicio,
        Fecha: new Date(data.Fecha),
        Hora: data.Hora,
        fechaHora,
        Modalidad: data.Modalidad,
        Descripcion: data.Descripcion,
        Comentarios: data.Comentarios ?? null,
        Estado: ESTADOCITA.PENDIENTE,
      },
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
      },
    });
  },
};
