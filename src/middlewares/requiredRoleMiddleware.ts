import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler";
import { AppError } from "../errors/AppError";
import {HTTPCODES} from "../utils/httpCodes";

export const requireRole = (roles: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const workerRoles = req.user?.roles as string[];

        const hasRole = roles.some(role => workerRoles.includes(role));

        if (!hasRole) {
            throw new AppError("Sem permissão para acessar esse recurso.", HTTPCODES.FORBIDDEN);
        }

        next();
    });