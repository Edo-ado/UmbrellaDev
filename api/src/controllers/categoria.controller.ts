import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoriaService } from "../services/categoria.service";

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
}
