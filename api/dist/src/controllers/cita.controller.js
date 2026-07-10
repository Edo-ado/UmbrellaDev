import { CitaServices } from "../services/cita.service";
import { StatusCodes } from "http-status-codes";
import { ESTADOCITA } from "../../generated/prisma/enums";
export class citaController {
    getAll = async (request, response, next) => {
        try {
            const cita = await CitaServices.getAll();
            return response.status(StatusCodes.OK).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getById = async (request, response, next) => {
        try {
            const { id } = request.params;
            const cita = await CitaServices.getById(Number(id));
            return response.status(StatusCodes.OK).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByProfesional = async (request, response, next) => {
        try {
            const { id } = request.params;
            const cita = await CitaServices.getByProfesional(Number(id));
            return response.status(StatusCodes.OK).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByStatus = async (request, response, next) => {
        try {
            const estado = request.params.estado.toUpperCase();
            if (!Object.values(ESTADOCITA).includes(estado)) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Estado Invalido" });
            }
            const cita = await CitaServices.getByStatus(estado);
            return response.status(StatusCodes.OK).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByFechas = async (request, response, next) => {
        const { fechaInicial, fechaFinal } = request.query;
        if (!fechaInicial || !fechaFinal) {
            return response
                .status(400)
                .json({ error: "Se necesitan valores minimos y maximos validos" });
        }
        const min = new Date(fechaInicial);
        const max = new Date(fechaFinal);
        if (isNaN(min.getTime()) || isNaN(max.getTime())) {
            return response
                .status(400)
                .json({ error: "Los precios deben ser números válidos" });
        }
        const citas = await CitaServices.getByFechas(min, max);
        response.json(citas);
    };
    create = async (request, response, next) => {
        try {
            const body = request.body;
            const cita = await CitaServices.create(body);
            return response.status(StatusCodes.CREATED).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    toggleStatus = async (request, response, next) => {
        try {
            const { id } = request.params;
            const cita = await CitaServices.toggleStatus(Number(id));
            return response.status(StatusCodes.OK).json(cita);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
}
