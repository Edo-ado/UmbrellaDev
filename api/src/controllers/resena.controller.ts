import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ResenaService } from "../services/resena.service";
import { Estado } from "../../generated/prisma/enums";

export class ResenaController {
  getAllByProfesional = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { profesionalId } = request.params;
    const resenas = await ResenaService.getAll(Number(profesionalId));

    return response.status(StatusCodes.OK).json(resenas);
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
      const resena = await ResenaService.getById(Number(id));

      return response.status(StatusCodes.OK).json(resena);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getDetailById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const resena = await ResenaService.getDetailById(Number(id));

      return response.status(StatusCodes.OK).json(resena);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  dejarResena = async (
      request: Request,
      response: Response,
      next: NextFunction,
    ) => {
      try {
        const body = request.body;
        const cita = await ResenaService.crear(body);
  
        return response.status(StatusCodes.CREATED).json(cita);
      } catch (error) {
        console.error(error);
        next(error);
      }
    };


    promedioCalificacionPorProfesional = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { idProfesional } = request.params;

    const resultado = await ResenaService.promedioCalificacionPorProfesional(
      Number(idProfesional),
    );

    return response.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



obtenerPorCita = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { citaId } = request.params;
    const resena = await ResenaService.obtenerPorCita(Number(citaId));
    return response.status(StatusCodes.OK).json(resena); // null si no existe
  } catch (error) {
    console.error(error);
    next(error);
  }
};














  
}
