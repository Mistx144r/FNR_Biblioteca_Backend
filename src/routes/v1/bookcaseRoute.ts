import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as bookcaseController from "../../controllers/bookcaseController";

const router = express.Router();

router.get("/", bookcaseController.getAll);
router.get("/:id", bookcaseController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcaseController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcaseController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcaseController.deleteById);

export default router;