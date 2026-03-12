import {Request, Response} from "express";
import * as workerService from "../services/workerService";
import {serializeBigInt} from "../utils/bigintSerializer";
import {asyncHandler} from "../middlewares/asyncHandler";

// Entender o pq o page e limit ficam em vermelho se retirar o ts-ignore.
const getAll = asyncHandler(async(req: Request, res: Response)=> {
    const { page, limit } = req.query
    // @ts-ignore
    const worker = await workerService.getAll(page, limit);
    res.status(200).json(serializeBigInt(worker));
});