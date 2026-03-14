import { Router } from "express";
import bookRoute from "./bookRoute";
import authorRoute from "./authorRoute";
import subCategoryRoute from "./subCategoryRoute";
import categoryRoute from "./categoryRoute";
import workerRoute from "./workerRoute";

const router = Router();

router.use("/books", bookRoute);
router.use("/authors", authorRoute);
router.use("/subcategories", subCategoryRoute);
router.use("/categories", categoryRoute);
router.use("/workers", workerRoute);

export default router;