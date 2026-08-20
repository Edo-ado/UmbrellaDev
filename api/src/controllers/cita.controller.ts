import { CitaServices } from "../services/cita.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ESTADOCITA } from "../../generated/prisma/enums";
import { soloFecha } from "../utils/time";

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

  getByFechas = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { fechaInicial, fechaFinal } = request.query;

      if (!fechaInicial || !fechaFinal) {
        return response
          .status(400)
          .json({ error: "Se necesitan valores minimos y maximos validos" });
      }

      const min = soloFecha(fechaInicial as string);
      const max = soloFecha(fechaFinal as string);

      if (isNaN(min.getTime()) || isNaN(max.getTime())) {
        return response
          .status(400)
          .json({ error: "Las fechas deben ser válidas" });
      }

      const citas = await CitaServices.getByFechas(min, max);
      return response.json(citas);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  solicitar = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const body = request.body;
      const cita = await CitaServices.solicitar(body);

      return response.status(StatusCodes.CREATED).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  aceptar = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const { comentario } = request.body; // opcional
      const cita = await CitaServices.aceptar(Number(id), comentario);
      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  rechazar = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const { motivo } = request.body;
      const cita = await CitaServices.rechazar(Number(id), motivo);
      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  cancelar = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const { motivo, actorRol } = request.body;
      const cita = await CitaServices.cancelar(Number(id), motivo, actorRol);
      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  completar = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = request.params;
      const cita = await CitaServices.completar(Number(id));
      return response.status(StatusCodes.OK).json(cita);
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
      const { id } = request.params;
      const { puntuacion, comentario } = request.body;
      const cita = await CitaServices.dejarResena(
        Number(id),
        Number(puntuacion),
        comentario,
      );
      return response.status(StatusCodes.OK).json(cita);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getCategorias = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const citas = await CitaServices.getCategorias();
      return response.status(StatusCodes.OK).json(citas);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
