import { Router } from "express";
import bookRoute from "./bookRoute";

const router = Router();

router.use("/books", bookRoute);

export default router;