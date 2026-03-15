// API Basic Packages
import { apiReference } from "@scalar/express-api-reference";
import { errorHandler } from "./middlewares/errorHandler";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger";

// API Routes Versions
import routesV1 from "./routes/v1";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/reference", apiReference({url: "/openapi.json"}));
app.use("/api/v1/", routesV1);
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`O Servidor esta rodando: http://localhost:${PORT}`);
});