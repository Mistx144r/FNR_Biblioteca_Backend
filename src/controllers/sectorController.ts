import { Request, Response } from "express";
import { createSectorSchema, updateSectorSchema } from "../schemas/sectorSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as sectorService from "../services/sectorService";

export const getAll = asyncHandler(async (req: Request, res: Response)=> {
    const sectors = await sectorService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(sectors));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sector = await sectorService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(sector));
});

export const getAllBookcasesInSectorById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookcases = await sectorService.getAllBookcasesInSectorById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(bookcases));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createSectorSchema.parse(req.body);
    const newSector = await sectorService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newSector));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateSectorSchema.parse(req.body);
    const updatedSector = await sectorService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedSector));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sector = await sectorService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(sector));
});
