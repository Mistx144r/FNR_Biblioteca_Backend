// API Basic Packages
import { apiReference } from "@scalar/express-api-reference";
import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");

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
app.use("/reference", apiReference({url: "/openapi.json"}));
app.use("/api/v1/", routesV1);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});