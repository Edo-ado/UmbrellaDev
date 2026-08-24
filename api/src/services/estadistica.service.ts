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

      if (cita.Estado === "COMPLETA") {
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

async getReporteCalificaciones(idprofesionalFiltro?: number) {
  
  // Umbral documentado: un servicio se considera de baja calificación
  // si su promedio de puntuación es menor a este valor (sobre 5)
  const UMBRAL_BAJA_CALIFICACION = 3;


  // Paso 1: Traigo todos los profesionales (o solo uno, si me pasaron filtro)
  let profesionales;

  if (idprofesionalFiltro) {
    profesionales = await prisma.usuario.findMany({
      where: {
        Id: idprofesionalFiltro,
        Role: "DESARROLLADOR",
      },
    });
  } else {
    profesionales = await prisma.usuario.findMany({
      where: {
        Role: "DESARROLLADOR",
      },
    });
  }


  // Paso 2: Traigo todas las reseñas, junto con el nombre del servicio
  // al que pertenece cada una (a través de la cita)
  const resenas = await prisma.resena.findMany({
    include: {
      cita: {
        include: {
          servicio: true,
        },
      },
    },
  });


  // Paso 3: Armo el reporte, un item por cada profesional
  const reporte: {
    nombreProfesional: string;
    promedioCalificacion: number;
    cantidadResenas: number;
    mejorServicioCalificado: string | null;
    serviciosBajaCalificacion: string[];
  }[] = [];


  for (const profesional of profesionales) {

    // Filtro solo las reseñas que le pertenecen a este profesional
    const resenasDelProfesional = resenas.filter(
      (r) => r.profesionalId === profesional.Id
    );


    // Si el profesional no tiene reseñas, lo agrego con valores en cero
    if (resenasDelProfesional.length === 0) {
      reporte.push({
        nombreProfesional: profesional.NombreCompleto,
        promedioCalificacion: 0,
        cantidadResenas: 0,
        mejorServicioCalificado: null,
        serviciosBajaCalificacion: [],
      });
      continue;
    }


    // Calculo el promedio general del profesional
    let sumaPuntuaciones = 0;
    for (const r of resenasDelProfesional) {
      sumaPuntuaciones += r.Puntuacion;
    }
    const promedio = sumaPuntuaciones / resenasDelProfesional.length;


    // Agrupo las reseñas por servicio, para sacar el promedio de cada servicio
    const puntuacionesPorServicio: Record<
      string,
      { suma: number; cantidad: number }
    > = {};

    for (const r of resenasDelProfesional) {
      const nombreServicio = r.cita.servicio.Nombre;

      if (!puntuacionesPorServicio[nombreServicio]) {
        puntuacionesPorServicio[nombreServicio] = { suma: 0, cantidad: 0 };
      }

      puntuacionesPorServicio[nombreServicio].suma += r.Puntuacion;
      puntuacionesPorServicio[nombreServicio].cantidad += 1;
    }


    // Calculo el promedio de cada servicio y busco el/los mejor(es)
    let mejorPromedio = -1;
    let mejoresServicios: string[] = [];
    const serviciosBajos: string[] = [];

    for (const nombreServicio in puntuacionesPorServicio) {
      const datos = puntuacionesPorServicio[nombreServicio];
      const promedioServicio = datos.suma / datos.cantidad;

      if (promedioServicio > mejorPromedio) {
        mejorPromedio = promedioServicio;
        mejoresServicios = [nombreServicio];
      } else if (promedioServicio === mejorPromedio) {
        mejoresServicios.push(nombreServicio);
      }

      if (promedioServicio < UMBRAL_BAJA_CALIFICACION) {
        serviciosBajos.push(nombreServicio);
      }
    }


    reporte.push({
      nombreProfesional: profesional.NombreCompleto,
      promedioCalificacion: Number(promedio.toFixed(2)),
      cantidadResenas: resenasDelProfesional.length,
      mejorServicioCalificado: mejoresServicios.join(", "),
      serviciosBajaCalificacion: serviciosBajos,
    });
  }


  return reporte;
}





};