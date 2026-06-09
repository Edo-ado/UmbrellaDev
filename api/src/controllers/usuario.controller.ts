import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UsuarioService } from "../services/usuarios.service";

export class usuarioController {
  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const usuarios = await UsuarioService.getAll();

      return response.status(StatusCodes.OK).json(usuarios);
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
      const usuario = await UsuarioService.getById(Number(id));

      return response.status(StatusCodes.OK).json(usuario);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
