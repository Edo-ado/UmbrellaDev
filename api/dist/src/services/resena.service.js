import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { ESTADOCITA } from "../../generated/prisma/enums";
import { Role } from "../../generated/prisma/enums";
export const ResenaService = {
    async getAll(profesionalId) {
        return prisma.resena.findMany({
            where: { profesionalId },
            select: {
                Id: true,
                Puntuacion: true,
                Comentario: true,
                CreatedAt: true,
                clienteId: true,
                cita: true,
            },
            orderBy: { CreatedAt: "desc" },
        });
    },
    async getById(id) {
        return prisma.resena.findUnique({
            where: { Id: id },
            select: {
                Id: true,
                Puntuacion: true,
                Comentario: true,
                cliente: {
                    select: { Id: true, NombreCompleto: true },
                },
                profesional: {
                    select: { Id: true, NombreCompleto: true },
                },
            },
        });
    },
    async getDetailById(id) {
        return prisma.resena.findUnique({
            where: { Id: id },
            include: {
                cliente: {
                    select: { Id: true, NombreCompleto: true, Foto: true },
                },
                profesional: {
                    select: { Id: true, NombreCompleto: true, Foto: true },
                },
                cita: true,
                imagenes: true,
            },
        });
    },
    //validaciones grandes
    async validarResenaUnica(citaId) {
        const resenaExistente = await prisma.resena.findUnique({
            where: { citaId },
        });
        if (resenaExistente) {
            throw AppError.badRequest("Esta cita ya cuenta con una reseña registrada, no se puede crear otra");
        }
    },
    async ValidarCalificacion(calificacion) {
        if (!Number.isInteger(calificacion)) {
            throw AppError.badRequest("La calificación debe ser un número entero");
        }
        if (calificacion < 1 || calificacion > 10) {
            throw AppError.badRequest("La calificación debe estar entre 1 y 10");
        }
    },
    async EsCitaCompletada(IdCita) {
        const cita = await prisma.cita.findUnique({
            where: { Id: IdCita },
            select: { Estado: true },
        });
        if (!cita) {
            throw AppError.badRequest("La cita indicada no existe");
        }
        if (cita.Estado !== ESTADOCITA.COMPLETA) {
            throw AppError.badRequest("Solo se pueden dejar reseñas de citas completadas");
        }
    },
    async crear(data) {
        if (!data.idcita) {
            throw AppError.badRequest("La cita es obligatoria");
        }
        if (!data.Comentario || data.Comentario.trim() === "") {
            throw AppError.badRequest("El comentario es obligatorio");
        }
        if (data.Puntuacion === undefined || data.Puntuacion === null) {
            throw AppError.badRequest("La calificación es obligatoria");
        }
        const idCita = Number(data.idcita);
        const puntuacion = Number(data.Puntuacion);
        const citaExiste = await prisma.cita.findUnique({
            where: { Id: idCita },
        });
        if (!citaExiste) {
            throw AppError.badRequest("La cita indicada no existe");
        }
        await this.EsCitaCompletada(idCita);
        await this.ValidarCalificacion(puntuacion);
        await this.validarResenaUnica(idCita);
        return await prisma.resena.create({
            data: {
                citaId: idCita,
                clienteId: citaExiste.idcliente,
                profesionalId: citaExiste.idprofesional,
                Comentario: data.Comentario,
                Puntuacion: puntuacion,
            },
            include: { cliente: true, profesional: true, cita: true },
        });
    },
    async promedioCalificacionPorProfesional(idProfesional) {
        const profesionalExiste = await prisma.usuario.findUnique({
            where: { Id: idProfesional },
        });
        if (!profesionalExiste) {
            throw AppError.badRequest("El profesional indicado no existe");
        }
        if (profesionalExiste.Role !== Role.DESARROLLADOR) {
            throw AppError.badRequest("El Usuario no es Desarrollador");
        }
        const resultado = await prisma.resena.aggregate({
            where: { profesionalId: idProfesional },
            _avg: { Puntuacion: true },
            _count: { Id: true },
        });
        return {
            idProfesional,
            promedio: resultado._avg.Puntuacion ?? 0,
            totalResenas: resultado._count.Id,
        };
    },
    // resena.service.ts
    async obtenerPorCita(citaId) {
        return prisma.resena.findUnique({
            where: { citaId },
            select: {
                Id: true,
                Puntuacion: true,
                Comentario: true,
                CreatedAt: true,
                cliente: {
                    select: { Id: true, NombreCompleto: true, Foto: true },
                },
            },
        });
    },
};
