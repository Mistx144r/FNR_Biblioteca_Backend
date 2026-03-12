import { Request, Response } from "express";
import { serializeBigInt } from "../utils/bigintSerializer";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as workerService from "../services/workerService";

// Entender o pq o page e limit ficam em vermelho se retirar o ts-ignore.
const getAll = asyncHandler(async(req: Request, res: Response)=> {
    const { page, limit } = req.query
    // @ts-ignore
    const worker = await workerService.getAll(page, limit);
    res.status(HTTPCODES.OK).json(serializeBigInt(worker));
});