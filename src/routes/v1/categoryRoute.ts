import express = require("express");
import * as categoryController from "../../controllers/categoryController";

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.post("/", categoryController.create);

router.put("/:id", categoryController.update);

router.delete("/:id", categoryController.deleteById);

export default router;