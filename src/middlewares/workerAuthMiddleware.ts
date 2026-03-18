import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../schemas/envSchema";
import { WorkerJwtPayload } from "../types/jwt/jwt";
import { asyncHandler } from "./asyncHandler";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

export const workerAuthMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        throw new AppError("Acesso não autorizado.", HTTPCODES.UNAUTHORIZED);
    }

    const decoded = jwt.verify(accessToken, String(env.JWTSECRETKEY), {
        issuer: "biblioteca-api",
        audience: "biblioteca-frontend",
        algorithms: ["HS256"]
    }) as WorkerJwtPayload;

    req.user = {
        id: decoded.id,
        roles: decoded.roles
    };

    next();
});