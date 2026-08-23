import { Router } from "express";
import { citaController } from "../controllers/cita.controller";
export class citasRoutes {
    static get routes() {
        console.log("Construyendo CitaRoutes");
        const router = Router();
        const citaControlleer = new citaController();
        router.get("/", citaControlleer.getAll);
        console.log("Ruta registrada: GET /");
        router.get("/id/:id", citaControlleer.getById);
        router.get("/Profesional/:id", citaControlleer.getByProfesional);
        router.get("/fechas", citaControlleer.getByFechas);
        router.get("/estado/:estado", citaControlleer.getByStatus);
        router.post("/aceptar/:id", citaControlleer.aceptar);
        router.post("/rechazar/:id", citaControlleer.rechazar);
        router.post("/cancelar/:id", citaControlleer.cancelar);
        router.post("/completar/:id", citaControlleer.completar);
        router.post("/dejarreseña/:id", citaControlleer.dejarResena);
        router.post("/solicitar", citaControlleer.solicitar);
        router.get("/categorias", citaControlleer.getCategorias);
        return router;
    }
}
