import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError"
import { ZodError } from "zod";
import {HTTPCODES} from "../utils/httpCodes";
import logger from "../utils/logger";

export function errorHandler(err: Error | AppError | ZodError | TokenExpiredError | JsonWebTokenError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(HTTPCODES.BADREQUEST).json({
            message: "Dados inválidos.",
            errors: err.issues.map(e => ({
                field: e.path.join("."),
                message: e.message
            }))
        });
    }

    if (err instanceof TokenExpiredError) {
        return res.status(HTTPCODES.UNAUTHORIZED).json({
            message: "Token expirado.",
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(HTTPCODES.UNAUTHORIZED).json({
            message: "Token inválido.",
        });
    }

    logger.error(err.message);
    return res.status(500).json({ message: "Internal Server Error." });
}