import express = require("express");
import { workerAuthMiddleware } from "../../middlewares/workerAuthMiddleware";
import { requireRole } from "../../middlewares/requiredRoleMiddleware";
import * as bookController from "../../controllers/bookController";
import {getAllBookCopiesWithBookId_AllInfo} from "../../controllers/bookController";

const router = express.Router();

// Main Book Functions
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.get("/:id/everything", bookController.getBookAllInfoById);
router.get("/:id/bookcopies/everything", bookController.getAllBookCopiesWithBookId_AllInfo);

router.post("/", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.create);

router.put("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.update);

router.delete("/:id", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.deleteById);

// Book Author Functions
router.get("/:id/authors", bookController.getAuthorsFromBook);

router.post("/:idBook/authors/:idAuthor", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.addAuthorToBook);

router.delete("/:idBook/authors/:idAuthor", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.removeAuthorToBook);

// Book Sub-Category Functions
router.get("/:idBook/subcategories/", bookController.getSubCategories);

router.post("/:idBook/subcategories/:idSubCategory", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.addSubCategory);

router.delete("/:idBook/subcategories/:idSubCategory", workerAuthMiddleware, requireRole(["Administrador", "Bibliotecário"]), bookController.removeSubCategory)

export default router;

