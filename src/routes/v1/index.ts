import { Router } from "express";
import bookRoute from "./bookRoute";
import authorRoute from "./authorRoute";
import subCategoryRoute from "./subCategoryRoute";
import categoryRoute from "./categoryRoute";
import workerRoute from "./workerRoute";
import sectorRoute from "./sectorRoute";
import bookcaseRoute from "./bookcaseRoute";
import bookcopyRoute from "./bookcopyRoute";

const router = Router();

router.use("/books", bookRoute);
router.use("/authors", authorRoute);
router.use("/subcategories", subCategoryRoute);
router.use("/categories", categoryRoute);
router.use("/workers", workerRoute);
router.use("/sectors", sectorRoute);
router.use("/bookcases", bookcaseRoute);
router.use("/bookcopies", bookcopyRoute);

export default router;