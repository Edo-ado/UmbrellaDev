import { Router } from "express";
import { EstadisticaController } from "../controllers/estadistica.controller";

export class EstadisticaRoutes {
  static get routes() {
    const router = Router();
    const estadisticaController = new EstadisticaController();
    router.get("/citas-por-estado", estadisticaController.getCitasPorEstado);
    return router;
  }
}