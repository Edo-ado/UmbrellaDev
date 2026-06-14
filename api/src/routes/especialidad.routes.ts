import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class especialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const especialidadcontroller = new EspecialidadController();

    router.get("/", especialidadcontroller.getAll);
    router.get("/id/:id", especialidadcontroller.getById);
    router.get("/buscar", especialidadcontroller.getByName);

    router.get("/estado/:estado", especialidadcontroller.getByEstado);
        router.patch("/:id/toggle-status", asyncHandler(especialidadcontroller.toggleStatus));
    

    return router;
  }
}
