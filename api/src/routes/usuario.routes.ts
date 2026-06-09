import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";


export class usuarioRoutes {
    static  get routes(): Router {
        const router = Router();
        const categoriaController = new usuarioController();

        router.get('/', categoriaController.getAll)
        router.get('/:id', categoriaController.getById)
        return router;
    }
}