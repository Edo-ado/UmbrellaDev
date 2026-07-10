import { Router } from "express";
import { citaController } from "../controllers/cita.controller";
export class citasRoutes {
    static get routes() {
        console.log("Construyendo CitaRoutes");
        const router = Router();
        const citaControlleer = new citaController();
        router.get("/", citaControlleer.getAll);
        console.log("Ruta registrada: GET /");
        router.post("/crear", citaControlleer.create);
        console.log("Ruta registrada: POST /crear");
        router.get("/id/:id", citaControlleer.getById);
        router.get("/Profesional/:id", citaControlleer.getByProfesional);
        router.get("/fechas", citaControlleer.getByFechas);
        router.get("/estado/:estado", citaControlleer.getByStatus);
        //CRUD
        router.post("/crear", citaControlleer.create);
        router.patch("/CambioEstado/:id", citaControlleer.toggleStatus);
        return router;
    }
}
