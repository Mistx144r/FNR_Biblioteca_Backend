import { Request, Response } from "express";
import { stateEnum } from "@prisma/client";
import { createBookCopySchema, updateBookCopySchema, updateBookCopyStateSchema } from "../schemas/bookcopySchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as bookcopyService from "../services/bookcopyService";

//==============================
// Main Copy Book Functions
//==============================
export const getAll = asyncHandler(async (req: Request, res: Response)=> {
    const bookcopies = await bookcopyService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(bookcopies));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookcopyService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(book));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createBookCopySchema.parse(req.body);
    const newBook = await bookcopyService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newBook));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateBookCopySchema.parse(req.body);
    const updatedCopyBook = await bookcopyService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedCopyBook));
});

export const deleteById = asyncHandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedCopyBook = await bookcopyService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedCopyBook));
});

//==============================
// Copy Book Utils Functions
//==============================
export const changeBookCopyState = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateBookCopyStateSchema.parse(req.body);
    const changeBookCopyState = await bookcopyService.changeBookCopyState(id, body.state as stateEnum);
    res.status(HTTPCODES.OK).json(serializeBigInt(changeBookCopyState));
});

export const changeBookCopyConsult = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const changeBookCopyConsult = await bookcopyService.changeBookCopyConsult(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(changeBookCopyConsult));
});