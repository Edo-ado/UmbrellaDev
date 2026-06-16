import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoriaService } from "../services/categoria.service";
import { Estado } from "../../generated/prisma/enums";

export class CategoriaController {
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categorias = await CategoriaService.getAll();

      return response.status(StatusCodes.OK).json(categorias);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const categoria = await CategoriaService.getById(Number(id));

      return response.status(StatusCodes.OK).json(categoria);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getByName = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const nombre = (request.query.nombre || request.query.Nombre) as string;
      const categoria = await CategoriaService.getByName(String(nombre));

      return response.status(StatusCodes.OK).json(categoria);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getByEstado = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const estado = (request.params.estado as string).toUpperCase();

      if (!Object.values(Estado).includes(estado as Estado)) {
        return response
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Rol inválido" });
      }

      const categoria = await CategoriaService.getByEstado(estado as Estado);
      return response.status(StatusCodes.OK).json(categoria);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
<<<<<<< HEAD
=======


toggleStatus = async (request: Request,response: Response,next: NextFunction,) => {
  try {
    const id = Number(request.params.id);
    const categoria = await CategoriaService.toggleStatus(id);

    return response.status(StatusCodes.OK).json(categoria);
  } catch (error) {
    next(error);
  }
};







>>>>>>> origin
}
