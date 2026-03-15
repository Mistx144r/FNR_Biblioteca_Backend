import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler";
import { AppError } from "../errors/AppError";
import {HTTPCODES} from "../utils/httpCodes";
import {WorkerJwtPayload} from "../types/jwt/jwt";

export const workerAuthMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        throw new AppError("Access token não encontrado.", HTTPCODES.UNAUTHORIZED);
    }

    const decoded = jwt.verify(accessToken, String(process.env.JWTSECRETKEY), {algorithms: ["HS256"]}) as WorkerJwtPayload;

    req.user = {
        id: decoded.id,
        name: decoded.name,
        roles: decoded.roles
    };

    next();
});