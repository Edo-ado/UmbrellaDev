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

  async getReportePorProfesional(idprofesionalFiltro?: number) {
    let citas;

    if (idprofesionalFiltro) {
      citas = await prisma.cita.findMany({
        where: {
          idprofesional: idprofesionalFiltro,
        },
        include: {
          profesional: true,
        },
      });
    } else {
      citas = await prisma.cita.findMany({
        include: {
          profesional: true,
        },
      });
    }

    const reporte: {
      nombreProfesional: string;
      totalCitas: number;
      citasCompletadas: number;
      porcentajeFinalizacion: number;
    }[] = [];

    for (const cita of citas) {
      const nombreDelProfesional = cita.profesional.NombreCompleto;

      let profesionalEnReporte:
        | {
            nombreProfesional: string;
            totalCitas: number;
            citasCompletadas: number;
            porcentajeFinalizacion: number;
          }
        | undefined;

      for (const item of reporte) {
        if (item.nombreProfesional === nombreDelProfesional) {
          profesionalEnReporte = item;
          break;
        }
      }

      if (!profesionalEnReporte) {
        profesionalEnReporte = {
          nombreProfesional: nombreDelProfesional,
          totalCitas: 0,
          citasCompletadas: 0,
          porcentajeFinalizacion: 0,
        };
        reporte.push(profesionalEnReporte);
      }

      profesionalEnReporte.totalCitas += 1;

      if (cita.Estado === "COMPLETADA") {
        profesionalEnReporte.citasCompletadas += 1;
      }
    }

    for (const item of reporte) {
      if (item.totalCitas > 0) {
        const porcentaje = (item.citasCompletadas / item.totalCitas) * 100;
        item.porcentajeFinalizacion = Number(porcentaje.toFixed(2));
      } else {
        item.porcentajeFinalizacion = 0;
      }
    }

    return reporte;
  },
};