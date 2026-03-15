import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as sectorController from "../../controllers/sectorController";

const router = express.Router();

router.get("/", sectorController.getAll);
router.get("/:id", sectorController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), sectorController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), sectorController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), sectorController.deleteById);

export default router;