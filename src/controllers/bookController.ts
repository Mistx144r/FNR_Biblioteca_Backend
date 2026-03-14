import { Request, Response } from "express";
import { createBookSchema, updateBookSchema } from "../schemas/bookSchema";
import { serializeBigInt } from "../utils/utils";
import { asyncHandler } from "../middlewares/asyncHandler";
import { HTTPCODES } from "../utils/httpCodes";
import * as bookService from "../services/bookService";

// Main Book Functions
export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query
    // @ts-ignore
    const books = await bookService.getAll(page, limit);
    res.status(HTTPCODES.OK).json(serializeBigInt(books));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.getById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(book));
});

export const getBookAllInfoById = asyncHandler(async(req: Request, res:Response)=> {
    const { id } = req.params;
    const book = await bookService.getAllBookInfoById(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(book));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const body = createBookSchema.parse(req.body);
    const newBook = await bookService.create(body);
    return res.status(HTTPCODES.CREATED).json(serializeBigInt(newBook));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = updateBookSchema.parse(req.body);
    const updatedBook = await bookService.update(id, body);
    return res.status(HTTPCODES.OK).json(serializeBigInt(updatedBook));
});

export const deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedBook = await bookService.deleteById(id);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(deletedBook));
});

// Book Author Functions
export const getAuthorsFromBook = asyncHandler(async (req: Request, res:Response) => {
    const { id } = req.params;
    const authors = await bookService.getAuthors(id);
    res.status(HTTPCODES.OK).json(serializeBigInt(authors));
});

export const addAuthorToBook = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idAuthor } = req.params;
    const relation = await bookService.addAuthor(idBook, idAuthor);
    res.status(HTTPCODES.CREATED).json(serializeBigInt(relation));
});

export const removeAuthorToBook = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idAuthor } = req.params;
    const relation = await bookService.removeAuthor(idBook, idAuthor);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(relation));
});

// Book Sub-Category Functions
export const getSubCategories = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook } = req.params;
    const relation = await bookService.getSubCategories(idBook);
    res.status(HTTPCODES.OK).json(serializeBigInt(relation));
})

export const addSubCategory = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idSubCategory } = req.params;
    const relation = await bookService.addSubCategory(idBook, idSubCategory);
    res.status(HTTPCODES.CREATED).json(serializeBigInt(relation));
})

export const removeSubCategory = asyncHandler(async(req: Request, res: Response)=> {
    const { idBook, idSubCategory } = req.params;
    const relation = await bookService.removeSubCategory(idBook, idSubCategory);
    res.status(HTTPCODES.NOCONTENT).json(serializeBigInt(relation));
})
