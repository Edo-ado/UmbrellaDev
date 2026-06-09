import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { EspecialidadService } from "../services/especialidad.service";

export class EspecialidadController {
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const especialidades = await EspecialidadService.getAll();

      return response.status(StatusCodes.OK).json(especialidades);
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
      const usuario = await EspecialidadService.getById(Number(id));

      return response.status(StatusCodes.OK).json(usuario);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
