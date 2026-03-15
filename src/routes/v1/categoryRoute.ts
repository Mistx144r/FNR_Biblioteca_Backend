import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as categoryController from "../../controllers/categoryController";

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), categoryController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), categoryController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), categoryController.deleteById);

export default router;