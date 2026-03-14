import express = require("express");
import * as workerController from "../../controllers/workerController";

const router = express.Router();

//================================
// Main Worker Functions
//================================
router.get("/", workerController.getAll);
router.get("/:id", workerController.getById);
router.get("/:id/everything", workerController.getWorkerAllInfoById);

router.post("/", workerController.create);

router.put("/:id", workerController.update);

router.delete("/:id", workerController.deleteById);

//================================
// Role Functions
//================================
router.get("/:id/roles", workerController.getRoles);
router.post("/:idWorker/roles/:idRole", workerController.addRole);
router.delete("/:idWorker/roles/:idRole", workerController.removeRole);

//================================
// Auth Functions
//================================
router.post("/login", workerController.login);

export default router;