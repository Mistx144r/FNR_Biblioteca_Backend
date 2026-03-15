import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as subCategoryController from "../../controllers/subCategoryController";

const router = express.Router();

router.get("/", subCategoryController.getAll);
router.get("/:id", subCategoryController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), subCategoryController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), subCategoryController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), subCategoryController.deleteById);

export default router;