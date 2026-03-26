import { Request, Response } from "express";
import { createInstitutionSchema, updateInstitutionSchema } from "../schemas/institutionSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as institutionService from "../services/institutionService";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const institutions = await institutionService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(institutions));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const institution = await institutionService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(institution));
});

export const getAllInstitutionSectorsById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sectors = await institutionService.getAllInstitutionSectorsById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(sectors));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createInstitutionSchema.parse(req.body);
    const newInstitution = await institutionService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newInstitution));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateInstitutionSchema.parse(req.body);
    const updatedInstitution = await institutionService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedInstitution));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedInstitution = await institutionService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedInstitution));
});