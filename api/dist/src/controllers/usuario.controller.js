import { StatusCodes } from "http-status-codes";
import { UsuarioService } from "../services/usuario.service";
import { MODALIDAD, Role } from "../../generated/prisma/enums";
export class usuarioController {
    getAll = async (request, response, next) => {
        try {
            const usuarios = await UsuarioService.getAll();
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getById = async (request, response, next) => {
        try {
            const { id } = request.params;
            const usuario = await UsuarioService.getById(Number(id));
            return response.status(StatusCodes.OK).json(usuario);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByRol = async (request, response, next) => {
        try {
            const { rol } = request.params;
            if (!Object.values(Role).includes(rol)) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Rol inválido" });
            }
            const usuarios = await UsuarioService.getByRol(rol);
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByModalidad = async (request, response, next) => {
        try {
            const { modalidad } = request.params;
            if (!Object.values(MODALIDAD).includes(modalidad)) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Modalidad inválida" });
            }
            const usuarios = await UsuarioService.getByModalidad(modalidad);
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getByDisponibilidad = async (request, response, next) => {
        try {
            const disponibilidad = request.params.disponibilidad === 'true';
            const usuarios = await UsuarioService.getByDisponibilidad(disponibilidad);
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    searchByName = async (request, response, next) => {
        try {
            const nombre = (request.query.nombre || request.query.Nombre);
            const Usuario = await UsuarioService.searchByNombre(String(nombre));
            return response.status(StatusCodes.OK).json(Usuario);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    crear = async (request, response, next) => {
        try {
            console.log("body:", request.body); // ← agregá esto
            const usuario = await UsuarioService.crear(request.body);
            return response.status(StatusCodes.CREATED).json({
                message: "Usuario creado correctamente",
                data: usuario,
            });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const usuario = await UsuarioService.actualizar(id, request.body);
            return response.status(StatusCodes.OK).json({
                message: "Usuario actualizado correctamente",
                data: usuario,
            });
        }
        catch (error) {
            next(error);
        }
    };
    toggleStatus = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const usuario = await UsuarioService.toggleStatus(id);
            return response.status(StatusCodes.OK).json(usuario);
        }
        catch (error) {
            next(error);
        }
    };
    toggleDisponibilidadByProfesional = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const usuario = await UsuarioService.toggleDisponibilidadByProfesional(id);
            return response.status(StatusCodes.OK).json(usuario);
        }
        catch (error) {
            next(error);
        }
    };
}
