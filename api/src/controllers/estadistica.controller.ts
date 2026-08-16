import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { EstadisticaService } from "../services/estadistica.service";
import { AuthRequest } from "../middlewares/auth.middleware";



export class EstadisticaController {
  getCitasPorEstado = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { fechaInicio, fechaFin, profesionalId, categoriaId } =
        request.query;

      if (!fechaInicio || !fechaFin) {
        return response
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "fechaInicio y fechaFin son obligatorios" });
      }

      const resultado = await EstadisticaService.getCitasPorEstado(
        new Date(fechaInicio as string),
        new Date(fechaFin as string),
        profesionalId ? Number(profesionalId) : undefined,
        categoriaId ? Number(categoriaId) : undefined,
      );

      return response.status(StatusCodes.OK).json(resultado);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };



getReportePorProfesional = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) => {
  try {
    const rol = request.user?.Role;
    const idUsuario = request.user?.Id;

    const idprofesionalFiltro =
      rol === "DESARROLLADOR" ? idUsuario : undefined;

    const resultado = await EstadisticaService.getReportePorProfesional(
      idprofesionalFiltro,
    );

    return response.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(error);
    next(error);
  }
};




}