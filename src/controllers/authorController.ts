import { Request, Response } from "express";
import { createAuthorSchema, updateAuthorSchema } from "../schemas/authorSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as authorService from "../services/authorService";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const authors = await authorService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(authors));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = await authorService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(author));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createAuthorSchema.parse(req.body);
    const newAuthor = await authorService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newAuthor));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateAuthorSchema.parse(req.body);
    const updatedAuthor = await authorService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedAuthor));
});

export const deleteById = asyncHandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedAuthor = await authorService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedAuthor));
});