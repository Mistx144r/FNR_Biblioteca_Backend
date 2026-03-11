import { Router } from "express";
import bookRoute from "./bookRoute";
import authorRoute from "./authorRoute";

const router = Router();

router.use("/books", bookRoute);
router.use("/authors", authorRoute);

export default router;