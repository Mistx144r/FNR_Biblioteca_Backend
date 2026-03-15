import { Request, Response } from "express";
import { createBookcaseSchema, updateBookcaseSchema } from "../schemas/bookcaseSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as bookcaseService from "../services/bookcaseService";

export const getAll = asyncHandler(async (req: Request, res: Response)=> {
    const bookcases = await bookcaseService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(bookcases));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookcase = await bookcaseService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(bookcase));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createBookcaseSchema.parse(req.body);
    const newBookcase = await bookcaseService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newBookcase));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateBookcaseSchema.parse(req.body);
    const updatedBookcase = await bookcaseService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedBookcase));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookcase = await bookcaseService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(bookcase));
});