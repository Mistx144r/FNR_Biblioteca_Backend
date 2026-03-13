// API Basic Packages
import { apiReference } from "@scalar/express-api-reference";
import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// API Routes Versions
import routesV1 from "./routes/v1";

dotenv.config();

export const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());
app.use("/reference", apiReference({url: "/openapi.json"}));
app.use("/api/v1/", routesV1);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});