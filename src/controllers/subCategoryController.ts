import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { serializeBigInt } from "../utils/bigintSerializer";
import * as subCategoryService from "../services/subCategoryService";

export const getAll = asyncHandler(async (req: Request, res: Response)=> {
    const SubCategories = await subCategoryService.getAll();
    res.status(200).json(serializeBigInt(SubCategories));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const SubCategory = await subCategoryService.getById(id);
    res.status(200).json(serializeBigInt(SubCategory));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const newSubCategory = await subCategoryService.create(req.body);
    return res.status(201).json(serializeBigInt(newSubCategory));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedSubCategory = await subCategoryService.update(id, req.body);
    return res.status(200).json(serializeBigInt(updatedSubCategory));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const SubCategory = await subCategoryService.deleteById(id);
    res.status(204).json(serializeBigInt(SubCategory));
});
