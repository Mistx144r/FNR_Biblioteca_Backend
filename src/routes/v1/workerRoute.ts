import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as workerController from "../../controllers/workerController";

const router = express.Router();

//================================
// Main Worker Functions
//================================
router.get("/", workerAuthMiddleware, workerController.getAll);
router.get("/:id", workerAuthMiddleware, workerController.getById);
router.get("/:id/everything", workerAuthMiddleware, workerController.getWorkerAllInfoById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador"]), workerController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador"]), workerController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador"]), workerController.deleteById);

//================================
// Role Functions
//================================
router.get("/:id/roles", workerAuthMiddleware, workerController.getRoles);
router.post("/:idWorker/roles/:idRole", workerAuthMiddleware, requireRole(["Administrador"]), workerController.addRole);
router.delete("/:idWorker/roles/:idRole", workerAuthMiddleware, requireRole(["Administrador"]), workerController.removeRole);

//================================
// Auth Functions
//================================
router.post("/auth/login", workerController.login);
router.post("/auth/refresh", workerController.refresh);
router.delete("/auth/logout", workerAuthMiddleware, workerController.logout);

export default router;