import { Request, Response } from "express";
import * as bookService from "../services/bookService";
import {serializeBigInt} from "../utils/bigintSerializer";

export async function getAll(req: Request, res: Response) {
    try {
        // @ts-ignore
        const books = await bookService.getAll(req.query.page, req.query.limit);
        res.status(200).json(serializeBigInt(books));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const book = await bookService.getById(req.params.id);
        res.status(200).json(serializeBigInt(book));
    } catch(err) {
        if (err.message == "Livro não encontrado.") {
            res.status(404).json({message: err.message});
        }
        res.status(500).json({ message: "Erro não especificado." });
    }
}

export async function create(req: Request, res: Response) {
    try {
        const newBook = await bookService.create(req.body);
        return res.status(201).json(serializeBigInt(newBook));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function deleteById(req: Request, res: Response) {
    try {
        const deletedBook = await bookService.deleteById(req.params.id);
        res.status(204).json(serializeBigInt(deletedBook));
    }   catch (err){
        res.status(500).json({message: err.message})
    }
}