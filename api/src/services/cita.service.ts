import { ESTADOCITA } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { combinarFechaHora, soloFecha } from "../utils/time";

export const CitaServices = {
  async getAll() {
    return await prisma.cita.findMany({
      include: {
        cliente: true,
        profesional: true,
        servicio: { include: { categoria: true } },
      },
    });
  },

  async getById(id: number) {
    return prisma.cita.findUnique({
      where: { Id: id },
      include: {
        cliente: true,
        profesional: true,
        servicio: true,
        historialEstadoCitas: {
          orderBy: { Fecha: "desc" },
        },
      },
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
        servicio: {
          include: {
            categoria: true,
          },
        },
        resenas: true,
      },
    });
  },

  async validarDisponibilidad(
    fechaHoraInicio: Date,
    fechaHoraFinNueva: Date,
    idprofesional: number,
  ) {
    const citas = await prisma.cita.findMany({
      where: {
        idprofesional,
        Estado: { notIn: ["CANCELADA", "RECHAZADA", "PENDIENTE"] },
      },
      select: { fechaHora: true, FechaHoraFin: true },
    });

    const existeCruce = citas.some((cita) => {
      if (!cita.fechaHora || !cita.FechaHoraFin) return false;
      return (
        fechaHoraInicio < cita.FechaHoraFin &&
        fechaHoraFinNueva > cita.fechaHora
      );
    });

    if (existeCruce) {
      throw AppError.badRequest("El profesional tiene una cita en proceso");
    }
  },

  async calcularMontoServicio(idservicio: number): Promise<number> {
    const servicio = await prisma.servicio.findUnique({
      where: { Id: idservicio },
      select: { Precio: true },
    });

    if (!servicio) {
      throw AppError.badRequest("El servicio indicado no existe");
    }

    const monto = Number(servicio.Precio);

    if (!Number.isFinite(monto) || monto < 0) {
      throw AppError.badRequest("El servicio no tiene un precio válido");
    }

    return monto;
  },

  async solicitar(data: any) {
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

    if (!profesionalExiste.Disponibilidad) {
      throw AppError.badRequest("El profesional no está disponible");
    }

    const idCliente = Number(data.idcliente);
    const idProfesional = Number(data.idprofesional);
    const idServicio = Number(data.idservicio);

    const servicioExiste = await prisma.servicio.findUnique({
      where: { Id: idServicio },
    });

    if (!servicioExiste) {
      throw AppError.badRequest("El servicio indicado no existe");
    }

    if (servicioExiste.idprofesional !== idProfesional) {
      throw AppError.badRequest(
        "El servicio no pertenece al profesional indicado",
      );
    }

    // Cambia Activo por el nombre real de tu campo.
    if (!servicioExiste.Estado || servicioExiste.Estado !== "ACTIVO") {
      throw AppError.badRequest("El servicio no está activo");
    }

    const duracionHoras = Number(servicioExiste.Duracion);
    const montoServicio = Number(servicioExiste.Precio);

    if (!Number.isFinite(duracionHoras) || duracionHoras <= 0) {
      throw AppError.badRequest("La duración del servicio no es válida");
    }

    if (!Number.isFinite(montoServicio) || montoServicio < 0) {
      throw AppError.badRequest("El precio del servicio no es válido");
    }

    const fechaHora = combinarFechaHora(data.Fecha, data.Hora);

    if (Number.isNaN(fechaHora.getTime())) {
      throw AppError.badRequest("La fecha u hora no son válidas");
    }

    if (fechaHora <= new Date()) {
      throw AppError.badRequest("La cita debe ser en una fecha futura");
    }

    const fechaHoraFin = new Date(
      fechaHora.getTime() + duracionHoras * 60 * 60 * 1000,
    );

    const horaFin = fechaHoraFin.toTimeString().slice(0, 5);

    await CitaServices.validarDisponibilidad(
      fechaHora,
      fechaHoraFin,
      idProfesional,
    );

    return await prisma.cita.create({
      data: {
        idcliente: idCliente,
        idprofesional: idProfesional,
        idservicio: idServicio,
        Fecha: soloFecha(data.Fecha),
        Hora: data.Hora,
        HoraFin: horaFin,
        fechaHora,
        FechaHoraFin: fechaHoraFin,
        TiempoTotal: duracionHoras,
        Monto: montoServicio,
        Estado: ESTADOCITA.PENDIENTE,
        Modalidad: data.Modalidad,
        Descripcion: data.Descripcion,
        Comentarios: data.Comentarios ?? null,
      },
      include: { cliente: true, profesional: true, servicio: true },
    });
  },

  async tieneCitaActiva(idprofesional: number): Promise<boolean> {
    const citaActiva = await prisma.cita.findFirst({
      where: {
        idprofesional,
        Estado: "ACEPTADA",
      },
      select: { Id: true },
    });

    return !!citaActiva;
  },

  async aceptar(id: number, motivo?: string) {
    const cita = await this.getById(id);

    if (!cita) {
      throw AppError.notFound("La cita indicada no existe");
    }

    if (cita.Estado !== ESTADOCITA.PENDIENTE) {
      throw AppError.badRequest("Solo se pueden aceptar citas pendientes");
    }

    const ocupado = await CitaServices.tieneCitaActiva(cita.idprofesional);
    if (ocupado) {
      throw AppError.badRequest(
        "No puedes aceptar esta cita hasta finalizar la anterior",
      );
    }

    const [citaActualizada] = await prisma.$transaction([
      prisma.cita.update({
        where: { Id: id },
        data: { Estado: ESTADOCITA.ACEPTADA },
      }),
      prisma.usuario.update({
        where: { Id: cita.idprofesional },
        data: { Disponibilidad: false },
      }),
      prisma.historialEstadoCita.create({
        data: {
          EstadoAnterior: cita.Estado,
          EstadoNuevo: ESTADOCITA.ACEPTADA,
          Motivo: motivo ?? null,
          citaId: id,
        },
      }),
    ]);

    return citaActualizada;
  },

  async rechazar(id: number, motivo?: string) {
    if (!motivo || motivo.trim() === "") {
      throw AppError.badRequest("El motivo de rechazo es obligatorio");
    }

    const cita = await CitaServices.getById(id);

    if (!cita) {
      throw AppError.notFound("La cita indicada no existe");
    }

    if (cita.Estado !== ESTADOCITA.PENDIENTE) {
      throw AppError.badRequest("Solo se pueden rechazar citas pendientes");
    }

    const citaActualizada = await prisma.cita.update({
      where: { Id: id },
      data: {
        Estado: ESTADOCITA.RECHAZADA,
      },
    });

    await prisma.historialEstadoCita.create({
      data: {
        EstadoAnterior: cita.Estado,
        EstadoNuevo: ESTADOCITA.RECHAZADA,
        Motivo: motivo ?? null,
        citaId: id,
      },
    });
    return citaActualizada;
  },

  async cancelar(id: number, motivo: string, actorRol: string) {
    const rol = actorRol?.trim().toUpperCase();

    const cita = await CitaServices.getById(id);

    if (!cita) {
      throw AppError.notFound("La cita indicada no existe");
    }

    const esPendiente = cita.Estado === ESTADOCITA.PENDIENTE;
    const esAceptada = cita.Estado === ESTADOCITA.ACEPTADA;

    if (!esPendiente && !esAceptada) {
      throw AppError.badRequest(
        "La cita no puede cancelarse en su estado actual",
      );
    }

    if (esPendiente && rol !== "CLIENTE") {
      throw AppError.badRequest(
        "Una cita pendiente solo puede cancelarla el cliente",
      );
    }

    if (esAceptada && rol !== "CLIENTE" && rol !== "PROFESIONAL") {
      throw AppError.badRequest(
        "Una cita aceptada solo puede cancelarla el cliente o el profesional",
      );
    }

    if (esAceptada && (!motivo || motivo.trim() === "")) {
      throw AppError.badRequest("El motivo de cancelación es obligatorio");
    }

    const CitaActualizada = await prisma.cita.update({
      where: { Id: id },
      data: {
        Estado: ESTADOCITA.CANCELADA,
      },
    });

    await prisma.historialEstadoCita.create({
      data: {
        EstadoAnterior: cita.Estado,
        EstadoNuevo: ESTADOCITA.CANCELADA,
        Motivo: motivo ?? null,
        citaId: id,
      },
    });

    return CitaActualizada;
  },

  async completar(id: number) {
    const cita = await CitaServices.getById(id);

    if (!cita) {
      throw AppError.notFound("La cita indicada no existe");
    }

    if (cita.Estado !== ESTADOCITA.ACEPTADA) {
      throw AppError.badRequest("Solo se pueden completar citas aceptadas");
    }

    if (!cita.FechaHoraFin) {
      throw AppError.badRequest(
        "La cita no tiene fecha de finalización registrada",
      );
    }

    const ahora = new Date();
    const tiempoTotalMinutos = Math.round(
      (ahora.getTime() - cita.fechaHora.getTime()) / 60000,
    );
    const horaFinReal = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;

    const [citaActualizada] = await prisma.$transaction([
      prisma.cita.update({
        where: { Id: id },
        data: {
          Estado: ESTADOCITA.COMPLETA,
          FechaHoraFin: ahora,
          HoraFin: horaFinReal,
          TiempoTotal: tiempoTotalMinutos,
        },
      }),
      prisma.usuario.update({
        where: { Id: cita.idprofesional },
        data: { Disponibilidad: true },
      }),
      prisma.historialEstadoCita.create({
        data: {
          EstadoAnterior: cita.Estado,
          EstadoNuevo: ESTADOCITA.COMPLETA,
          citaId: id,
        },
      }),
    ]);

    return citaActualizada;
  },

  async getCategorias() {
    return await prisma.cita.findMany({
      include: {
        servicio: { include: { categoria: true } },
      },
    });
  },
};
