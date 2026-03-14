import { Request, Response } from "express";
import {createCategorySchema, updateCategorySchema} from "../schemas/categorySchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as categoryService from "../services/categoryService";

export const getAll = asyncHandler(async(req: Request, res: Response)=> {
   const categories = await categoryService.getAll();
   res.status(HTTPCODES.OK).json(serializeBigInt(categories));
});

export const getById = asyncHandler(async(req: Request, res: Response)=> {
    const { id } = req.params;
    const categories = await categoryService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(categories));
});

export const create = asyncHandler(async(req: Request, res: Response)=> {
    const body = createCategorySchema.parse(req.body);
    const categories = await categoryService.create(body);
    res.status(HTTPCODES.CREATED).json(serializeBigInt(categories));
});

export const update = asyncHandler(async(req: Request, res: Response)=> {
    const { id } = req.params;
    const body = updateCategorySchema.parse(req.body);
    const categories = await categoryService.update(id, body);
    res.status(HTTPCODES.OK).json(serializeBigInt(categories));
});

export const deleteById = asyncHandler(async(req: Request, res: Response)=> {
    const { id } = req.params;
    const categories = await categoryService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(categories));
});