import { StatusCodes } from "http-status-codes";
import { EstadisticaService } from "../services/estadistica.service";
export class EstadisticaController {
    getCitasPorEstado = async (request, response, next) => {
        try {
            const { fechaInicio, fechaFin, profesionalId, categoriaId } = request.query;
            if (!fechaInicio || !fechaFin) {
                return response
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: "fechaInicio y fechaFin son obligatorios" });
            }
            const resultado = await EstadisticaService.getCitasPorEstado(new Date(fechaInicio), new Date(fechaFin), profesionalId ? Number(profesionalId) : undefined, categoriaId ? Number(categoriaId) : undefined);
            return response.status(StatusCodes.OK).json(resultado);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getReportePorProfesional = async (request, response, next) => {
        try {
            const rol = request.user?.Role;
            const idUsuario = request.user?.Id;
            const idprofesionalFiltro = rol === "DESARROLLADOR" ? idUsuario : undefined;
            const resultado = await EstadisticaService.getReportePorProfesional(idprofesionalFiltro);
            return response.status(StatusCodes.OK).json(resultado);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    getReporteCalificaciones = async (request, response, next) => {
        try {
            const rol = request.user?.Role;
            const idUsuario = request.user?.Id;
            const idprofesionalFiltro = rol === "DESARROLLADOR" ? idUsuario : undefined;
            const resultado = await EstadisticaService.getReporteCalificaciones(idprofesionalFiltro);
            return response.status(StatusCodes.OK).json(resultado);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
}
