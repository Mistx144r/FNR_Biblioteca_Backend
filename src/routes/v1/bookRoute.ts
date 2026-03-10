import express = require("express");
import * as bookController from "../../controllers/bookController";

const router = express.Router();

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);

router.post("/", bookController.create);

router.delete("/:id", bookController.deleteById);

export default router;