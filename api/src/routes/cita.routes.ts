import { Router } from "express";
import { citaController } from "../controllers/cita.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class citasRoutes {
  static get routes(): Router {
    const router = Router();
    const citaControlleer = new citaController();

    router.get("/", citaControlleer.getAll);

    router.get("/id/:id", citaControlleer.getById);

    router.get("/Profesional/:id", citaControlleer.getByProfesional);

    router.get("/fechas", citaControlleer.getByFechas);

    router.get("/estado/:estado", citaControlleer.getByStatus);
  
    return router;
  }
}
