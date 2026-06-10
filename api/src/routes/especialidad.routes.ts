import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";

export class especialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const especialidadcontroller = new EspecialidadController();

    router.get("/", especialidadcontroller.getAll);
    router.get("/id/:id", especialidadcontroller.getById);
    router.get("/buscar", especialidadcontroller.getByName);

    router.get("/estado/:estado", especialidadcontroller.getByEstado);

    return router;
  }
}
