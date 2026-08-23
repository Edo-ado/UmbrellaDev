import { StatusCodes } from "http-status-codes";
import { CategoriaService } from "../services/categoria.service";
import { Estado } from "../../generated/prisma/enums";
export class CategoriaController {
    getAll = async (request, response, next) => {
        try {
            const categorias = await CategoriaService.getAll();
            return response.status(StatusCodes.OK).json(categorias);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getById = async (request, response, next) => {
        try {
            const { id } = request.params;
            const categoria = await CategoriaService.getById(Number(id));
            return response.status(StatusCodes.OK).json(categoria);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getAllActivos = async (request, response, next) => {
        try {
            const categorias = await CategoriaService.GetAllActivos();
            return response.status(StatusCodes.OK).json(categorias);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByName = async (request, response, next) => {
        try {
            const nombre = (request.query.nombre || request.query.Nombre);
            const categoria = await CategoriaService.getByName(String(nombre));
            return response.status(StatusCodes.OK).json(categoria);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByEstado = async (request, response, next) => {
        try {
            const estado = request.params.estado.toUpperCase();
            if (!Object.values(Estado).includes(estado)) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Rol inválido" });
            }
            const categoria = await CategoriaService.getByEstado(estado);
            return response.status(StatusCodes.OK).json(categoria);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    toggleStatus = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const categoria = await CategoriaService.toggleStatus(id);
            return response.status(StatusCodes.OK).json(categoria);
        }
        catch (error) {
            next(error);
        }
    };
}
