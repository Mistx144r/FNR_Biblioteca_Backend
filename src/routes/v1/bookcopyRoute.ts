import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as bookcopyController from "../../controllers/bookcopyController";

const router = express.Router();

//==============================
// Copy Book Main Functions
//==============================
router.get("/", bookcopyController.getAll);
router.get("/:id", bookcopyController.getById);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.deleteById);

//==============================
// Copy Book Utils Functions
//==============================
router.patch("/state/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.changeBookCopyState);
router.patch("/virtual/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.changeBookCopyVirtual);
router.patch("/consult/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookcopyController.changeBookCopyConsult);

export default router;
