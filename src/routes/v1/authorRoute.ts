import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as authorController from "../../controllers/authorController";

const router = express.Router();

router.get("/", authorController.getAll);
router.get("/:id", authorController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), authorController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), authorController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), authorController.deleteById);

export default router;