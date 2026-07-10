import { StatusCodes } from "http-status-codes";
import { ServicioServices } from "../services/servicio.service";
import { MODALIDAD } from "../../generated/prisma/enums";
export class ServicioController {
    getAll = async (request, response, next) => {
        try {
            const servicio = await ServicioServices.getAll();
            return response.status(StatusCodes.OK).json(servicio);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getById = async (request, response, next) => {
        try {
            const { id } = request.params;
            const Servicio = await ServicioServices.getById(Number(id));
            return response.status(StatusCodes.OK).json(Servicio);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByName = async (request, response, next) => {
        try {
            const nombre = (request.query.nombre || request.query.Nombre);
            const categoria = await ServicioServices.searchByName(String(nombre));
            return response.status(StatusCodes.OK).json(categoria);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByProfesional = async (request, response, next) => {
        try {
            const { id } = request.params;
            const Servicio = await ServicioServices.getByProfesional(Number(id));
            return response.status(StatusCodes.OK).json(Servicio);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByCategories = async (request, response, next) => {
        try {
            const { id } = request.params;
            const Servicio = await ServicioServices.getByCategories(Number(id));
            return response.status(StatusCodes.OK).json(Servicio);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByModalidad = async (request, response, next) => {
        try {
            const Modalidad = request.params.modalidad.toUpperCase();
            if (!Object.values(MODALIDAD).includes(Modalidad)) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Modalidad inválida" });
            }
            const Servicio = await ServicioServices.getByModalidad(Modalidad);
            return response.status(StatusCodes.OK).json(Servicio);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByRangoPrecio = async (request, response, next) => {
        const { precioMin, precioMax } = request.query;
        if (!precioMin || !precioMax) {
            return response
                .status(400)
                .json({ error: "Se necesitan valores minimos y maximos validos" });
        }
        const min = parseFloat(precioMin);
        const max = parseFloat(precioMax);
        if (isNaN(min) || isNaN(max)) {
            return response
                .status(400)
                .json({ error: "Los precios deben ser números válidos" });
        }
        const servicios = await ServicioServices.getByRangoPrecio(min, max);
        response.json(servicios);
    };
    toggleStatus = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const servicio = await ServicioServices.toggleStatus(id);
            return response.status(StatusCodes.OK).json(servicio);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (request, response, next) => {
        try {
            const servicio = await ServicioServices.create(request.body);
            return response.status(StatusCodes.CREATED).json(servicio);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const servicio = await ServicioServices.update(id, request.body);
            return response.status(StatusCodes.OK).json(servicio);
        }
        catch (error) {
            next(error);
        }
    };
}
