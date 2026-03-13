import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError"
import { ZodError } from "zod";;
import logger from "../utils/logger"

export function errorHandler(err: Error | AppError | ZodError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Dados inválidos.",
            errors: err.issues.map(e => ({
                field: e.path.join("."),
                message: e.message
            }))
        });
    }

    logger.error(err.message);
    return res.status(500).json({ message: "Internal Server Error." });
}