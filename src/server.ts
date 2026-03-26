// API Basic Packages
import { apiReference } from "@scalar/express-api-reference";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./schemas/envSchema"

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";

// API Routes Versions
import routesV1 from "./routes/v1";

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/reference", apiReference({url: "/openapi.json"}));
app.use("/api/v1/", routesV1);
app.use(errorHandler);

app.listen(env.PORT ?? 3000, '0.0.0.0', () => {
    logger.info(`O Servidor esta rodando: http://localhost:${PORT}`);
});