import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class CategoriaRoutes {
  static get routes(): Router {
    const router = Router();
    const categoriaController = new CategoriaController();

    router.get("/", categoriaController.getAll);
    
    router.get("/id/:id", categoriaController.getById);

    router.get("/buscar", categoriaController.getByName);

    router.get("/estado/:estado", categoriaController.getByEstado);

        router.patch("/:id/toggle-status", asyncHandler(categoriaController.toggleStatus));
    

    return router;
  }
}
