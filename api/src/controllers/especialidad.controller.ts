import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { EspecialidadService } from "../services/especialidad.service";
import { Estado } from "../../generated/prisma/enums";

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
      const especialidad = await EspecialidadService.getById(Number(id));

      return response.status(StatusCodes.OK).json(especialidad);
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
        const especialidad = await EspecialidadService.getByName(String(nombre));
  
        return response.status(StatusCodes.OK).json(especialidad);
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
  
        const especialidad = await EspecialidadService.getByEstado(estado as Estado);
        return response.status(StatusCodes.OK).json(especialidad);
      } catch (error) {
        console.error(error);
        next(error);
      }
    };

toggleStatus = async (request: Request,response: Response,next: NextFunction,) => {
  try {
    const id = Number(request.params.id);
    const especialidad = await EspecialidadService.toggleStatus(id);

    return response.status(StatusCodes.OK).json(especialidad);
  } catch (error) {
    next(error);
  }
};



}
