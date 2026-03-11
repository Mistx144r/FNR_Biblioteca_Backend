import express = require("express");
import * as bookController from "../../controllers/bookController";

const router = express.Router();

// Main Book Functions
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);

router.post("/", bookController.create);

router.put("/:id", bookController.update);

router.delete("/:id", bookController.deleteById);

// Book Author Functions
router.get("/:id/authors");

router.post("/:id/authors");

router.delete("/:id/authors");

// Book Sub-Category Functions

export default router;