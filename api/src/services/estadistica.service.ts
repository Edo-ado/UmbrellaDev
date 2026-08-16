import { prisma } from "../config/prisma";

export const EstadisticaService = {
  async getCitasPorEstado(
    fechaInicio: Date,
    fechaFin: Date,
    idprofesional?: number,
    idcategoria?: number,
  ) {
    const citas = await prisma.cita.findMany({
      where: {
        Fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        ...(idprofesional ? { idprofesional } : {}),
        ...(idcategoria
          ? { servicio: { idcategoria } }
          : {}),
      },
      select: {
        Estado: true,
      },
    });

    const conteo: Record<string, number> = {};
    citas.forEach((c) => {
      conteo[c.Estado] = (conteo[c.Estado] || 0) + 1;
    });

    return Object.entries(conteo).map(([estado, total]) => ({
      estado,
      total,
    }));
  },
};