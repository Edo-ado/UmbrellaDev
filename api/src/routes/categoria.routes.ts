import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
<<<<<<< HEAD
=======
import { asyncHandler } from "../middlewares/async-handler.middleware";
>>>>>>> origin

export class CategoriaRoutes {
  static get routes(): Router {
    const router = Router();
    const categoriaController = new CategoriaController();

    router.get("/", categoriaController.getAll);
    
    router.get("/id/:id", categoriaController.getById);

    router.get("/buscar", categoriaController.getByName);

    router.get("/estado/:estado", categoriaController.getByEstado);

<<<<<<< HEAD
=======
        router.patch("/:id/toggle-status", asyncHandler(categoriaController.toggleStatus));
>>>>>>> origin
    

    return router;
  }
}
