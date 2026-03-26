import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as institutionController from "../../controllers/institutionController";

const router = express.Router();

router.get("/", institutionController.getAll);
router.get("/:id", institutionController.getById);
router.get("/:id/sectors", institutionController.getAllInstitutionSectorsById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador"]), institutionController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador"]), institutionController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador"]), institutionController.deleteById);

export default router;