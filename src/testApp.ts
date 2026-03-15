import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import cors from "cors";

import routesV1 from "./routes/v1";

export const app = express();

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", routesV1);
app.use(errorHandler);