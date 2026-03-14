import { Request, Response } from "express";
import { createSubCategorySchema, updateSubCategorySchema } from "../schemas/subCategorySchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as subCategoryService from "../services/subCategoryService";

export const getAll = asyncHandler(async (req: Request, res: Response)=> {
    const SubCategories = await subCategoryService.getAll();
    res.status(HTTPCODES.OK).json(serializeBigInt(SubCategories));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const SubCategory = await subCategoryService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(SubCategory));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createSubCategorySchema.parse(req.body);
    const newSubCategory = await subCategoryService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newSubCategory));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateSubCategorySchema.parse(req.body);
    const updatedSubCategory = await subCategoryService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedSubCategory));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const SubCategory = await subCategoryService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(SubCategory));
});
