import { apiReference } from "@scalar/express-api-reference";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const api: express.Application = express();
const PORT = 3000;

api.use(
  cors({
    origin: "*",
  }),
);

api.use(express.json());
api.use(
  "/reference",
  apiReference({
    url: "/openapi.json",
  }),
);

api.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
