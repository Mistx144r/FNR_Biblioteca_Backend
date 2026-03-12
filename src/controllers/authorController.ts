import { Request, Response } from "express";
import { serializeBigInt } from "../utils/bigintSerializer";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as authorService from "../services/authorService";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const books = await authorService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(books));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await authorService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(book));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const newBook = await authorService.create(req.body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newBook));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedBook = await authorService.update(id, req.body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedBook));
});

export const deleteById = asyncHandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedBook = await authorService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedBook));
});