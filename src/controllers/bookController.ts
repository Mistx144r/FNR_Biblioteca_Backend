import { Request, Response } from "express";
import * as bookService from "../services/bookService";
import { serializeBigInt } from "../utils/bigintSerializer";
import { asyncHandler } from "../middlewares/asyncHandler";

// Main Book Functions
export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query
    // @ts-ignore
    const books = await bookService.getAll(page, limit);
    res.status(200).json(serializeBigInt(books));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.getById(id);
    res.status(200).json(serializeBigInt(book));
});

export const getBookAllInfoById = asyncHandler(async(req: Request, res:Response)=> {
    const { id } = req.params;
    const book = await bookService.getAllBookInfoById(id);
    res.status(200).json(serializeBigInt(book));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const newBook = await bookService.create(req.body);
    return res.status(201).json(serializeBigInt(newBook));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedBook = await bookService.update(id, req.body);
    return res.status(200).json(serializeBigInt(updatedBook));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedBook = await bookService.deleteById(id);
    res.status(204).json(serializeBigInt(deletedBook));
});

// Book Author Functions
export const getAuthorsFromBook = asyncHandler(async (req: Request, res:Response) => {
    const { id } = req.params;
    const authors = await bookService.getAuthors(id);
    res.status(200).json(serializeBigInt(authors));
});

export const addAuthorToBook = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idAuthor } = req.params;
    const relation = await bookService.addAuthor(idBook, idAuthor);
    res.status(201).json(serializeBigInt(relation));
});

export const removeAuthorToBook = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idAuthor } = req.params;
    const relation = await bookService.removeAuthor(idBook, idAuthor);
    res.status(204).json(serializeBigInt(relation));
});

// Book Sub-Category Functions
export const getSubCategories = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook } = req.params;
    const relation = await bookService.getSubCategories(idBook);
    res.status(200).json(serializeBigInt(relation));
})

export const addSubCategory = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idSubCategory } = req.params;
    const relation = await bookService.addSubCategory(idBook, idSubCategory);
    res.status(201).json(serializeBigInt(relation));
})

export const removeSubCategory = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idSubCategory } = req.params;
    const relation = await bookService.removeSubCategory(idBook, idSubCategory);
    res.status(204).json(serializeBigInt(relation));
})
