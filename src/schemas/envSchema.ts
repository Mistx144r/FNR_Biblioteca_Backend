import { z } from "zod";
import dotenv from "dotenv";
dotenv.config()

const envSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    JWTSECRETKEY: z.string().min(32),
    NODE_ENV: z.enum(["development", "production", "test"]),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    ACCESSEXPIRETIMEINSECONDS: z.string(),
    REFRESHEXPIRETIMEINSECONDS: z.string(),
});

export const env = envSchema.parse(process.env);