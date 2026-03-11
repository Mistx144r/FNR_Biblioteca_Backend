import express = require("express");
import * as authorController from "../../controllers/authorController";

const router = express.Router();

router.get("/", authorController.getAll);
router.get("/:id", authorController.getById);

router.post("/", authorController.create);

router.put("/:id", authorController.update);

router.delete("/:id", authorController.deleteById);

export default router;