import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";
<<<<<<< HEAD
=======
import { asyncHandler } from "../middlewares/async-handler.middleware";
>>>>>>> origin

export class ServicioRoutes {
  static get routes(): Router {
    const router = Router();
    console.log("Construyendo ServicioRoutes");
    const ServiciosController = new ServicioController();

    router.get("/", ServiciosController.getAll);

    router.get("/id/:id", ServiciosController.getById);

    router.get("/profesional/:id", ServiciosController.getByProfesional);

    router.get("/categoria/:id", ServiciosController.getByCategories);

    router.get("/buscar", ServiciosController.getByName);

    router.get("/modalidad/:modalidad", ServiciosController.getByModalidad);

    router.get("/rango-precio", ServiciosController.getByRangoPrecio);

<<<<<<< HEAD

=======
    router.post("/", asyncHandler(ServiciosController.create));
    router.put("/:id", asyncHandler(ServiciosController.update));
    router.patch("/:id/toggle-status", asyncHandler(ServiciosController.toggleStatus));
    
>>>>>>> origin

    
    return router;
  }
}
