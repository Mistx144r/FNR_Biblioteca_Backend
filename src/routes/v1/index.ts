import { Router } from "express";
import bookRoute from "./bookRoute";
import authorRoute from "./authorRoute";
import subCategoryRoute from "./subCategoryRoute";

const router = Router();

router.use("/books", bookRoute);
router.use("/authors", authorRoute);
router.use("/subcategories", subCategoryRoute);

export default router;