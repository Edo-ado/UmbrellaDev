import { Router } from "express";
import { ResenaController } from "../controllers/resena.controller";
export class resenasRoutes {
    static get routes() {
        console.log("Construyendo CitaRoutes");
        const router = Router();
        const ResenaControllers = new ResenaController();
        router.get("/profesional/:profesionalId", ResenaControllers.getAllByProfesional);
        router.get("/id/:id", ResenaControllers.getById);
        router.get("/detalle/:id", ResenaControllers.getDetailById);
        //create
        router.post("/dejarResena", ResenaControllers.dejarResena);
        router.get("/promedio/:idProfesional", ResenaControllers.promedioCalificacionPorProfesional);
        // resena.routes.ts
        router.get("/porCita/:citaId", ResenaControllers.obtenerPorCita);
        return router;
    }
}
