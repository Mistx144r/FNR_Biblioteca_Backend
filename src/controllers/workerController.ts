import {Request, Response} from "express";
import * as workerService from "../services/workerService";
import {serializeBigInt} from "../utils/bigintSerializer";

export async function getAll(req: Request, res: Response) {
    try {
        // @ts-ignore
        const worker = await workerService.getAll(req.query.page, req.query.limit);
        res.status(200).json(serializeBigInt(worker));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}