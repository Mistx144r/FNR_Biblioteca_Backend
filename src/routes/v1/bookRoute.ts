import express = require("express");
import * as bookController from "../../controllers/bookController";

const router = express.Router();

// Main Book Functions
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.get("/:id/everything", bookController.getBookAllInfoById);

router.post("/", bookController.create);

router.put("/:id", bookController.update);

router.delete("/:id", bookController.deleteById);

// Book Author Functions
router.get("/:id/authors", bookController.getAuthorsFromBook);

router.post("/:idBook/authors/:idAuthor", bookController.addAuthorToBook);

router.delete("/:idBook/authors/:idAuthor", bookController.removeAuthorToBook);

// Book Sub-Category Functions
router.get("/:idBook/subcategories/", bookController.getSubCategories);

router.post("/:idBook/subcategories/:idSubCategory", bookController.addSubCategory);

router.delete("/:idBook/subcategories/:idSubCategory", bookController.removeSubCategory)

export default router;

