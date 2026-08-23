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
    getAllDesarrolladores = async (request, response, next) => {
        try {
            const usuarios = await UsuarioService.getByRol(Role.DESARROLLADOR);
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    crear = async (request, response, next) => {
        try {
            console.log("body:", request.body);
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
            if (!request.user) {
                return response.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Usuario no autenticado",
                });
            }
            const usuario = await UsuarioService.actualizar(request.user.Id, request.body, request.file);
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
    getByFechas = async (request, response, next) => {
        try {
            const { fechaInicial, fechaFinal } = request.query;
            if (!fechaInicial || !fechaFinal) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Se necesitan fechaInicial y fechaFinal" });
            }
            const min = new Date(fechaInicial);
            const max = new Date(fechaFinal);
            if (isNaN(min.getTime()) || isNaN(max.getTime())) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "Las fechas deben ser válidas" });
            }
            const usuarios = await UsuarioService.getByFechas(min, max);
            return response.status(StatusCodes.OK).json(usuarios);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    login = async (request, response, next) => {
        try {
            const { Email: email, Contrasena: contrasena } = request.body;
            const resultado = await UsuarioService.login({
                email,
                contrasena
            });
            return response
                .status(StatusCodes.OK)
                .json({
                success: true,
                message: "Inicio de sesión exitoso",
                data: resultado
            });
        }
        catch (error) {
            next(error);
        }
    };
    register = async (request, response, next) => {
        try {
            const usuario = await UsuarioService.registrar({
                email: request.body.Email,
                Contrasena: request.body.Contrasena,
                nombre: request.body.NombreCompleto,
                pais: request.body.Pais,
                role: request.body.Role,
                edad: request.body.Edad,
                telefono: request.body.Telefono
            });
            return response
                .status(StatusCodes.CREATED)
                .json({
                success: true,
                message: "Usuario registrado correctamente",
                data: usuario
            });
        }
        catch (error) {
            next(error);
        }
    };
    perfil = async (request, response, next) => {
        try {
            const id = request.user?.Id ?? Number(request.params.id);
            const usuario = await UsuarioService.perfil(id);
            return response
                .status(StatusCodes.OK)
                .json({
                success: true,
                data: usuario
            });
        }
        catch (error) {
            next(error);
        }
    };
}
