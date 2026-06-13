import { CitaServices } from "../services/cita.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ESTADOCITA } from "../../generated/prisma/enums";

export class citaController {
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const cita = await CitaServices.getAll();

      return response.status(StatusCodes.OK).json(cita);
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
      const cita = await CitaServices.getById(Number(id));

      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getByProfesional = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const cita = await CitaServices.getByProfesional(Number(id));

      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getByStatus = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const estado = (request.params.estado as string).toUpperCase();
      if (!Object.values(ESTADOCITA).includes(estado as ESTADOCITA)) {
        return response
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Estado Invalido" });
      }
      const cita = await CitaServices.getByStatus(estado as ESTADOCITA);

      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getByFechas = async (request: Request, response: Response, next: NextFunction) => {
      const  { fechaInicial, fechaFinal } = request.query;
  


      if (!fechaInicial || !fechaFinal) {
        return response
          .status(400)
          .json({ error: "Se necesitan valores minimos y maximos validos" });
      }
  
      const min = new Date(fechaInicial as string);
      const max = new  Date(fechaFinal as string);
  
      if (isNaN(min.getTime()) || isNaN(max.getTime())) {
        return response
          .status(400)
          .json({ error: "Los precios deben ser números válidos" });
      }
  
      const citas = await CitaServices.getByFechas(min, max);
      response.json(citas);
    };

toggleStatus = async (request: Request,response: Response,next: NextFunction,) => {
  try {
    const id = Number(request.params.id);
    const cita = await CitaServices.toggleStatus(id);

    return response.status(StatusCodes.OK).json(cita);
  } catch (error) {
    next(error);
  }
};



}
