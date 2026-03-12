import express = require("express");
import * as subCategoryController from "../../controllers/subCategoryController";

const router = express.Router();

router.get("/", subCategoryController.getAll, );
router.get("/:id", subCategoryController.getById);

router.post("/", subCategoryController.create);

router.put("/:id", subCategoryController.update);

router.delete("/:id", subCategoryController.deleteById);

export default router;