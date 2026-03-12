import { Request, Response } from "express";
import * as authorService from "../services/authorService";
import {serializeBigInt} from "../utils/bigintSerializer";

// Fazer uma revisao total nesse codigo.

export async function getAll(req: Request, res: Response) {
    try {
        // @ts-ignore
        const books = await authorService.getAll();
        res.status(200).json(serializeBigInt(books));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const book = await authorService.getById(req.params.id);
        res.status(200).json(serializeBigInt(book));
    } catch(err) {
        if (err.message == "Autor não encontrado.") {
            res.status(404).json({message: err.message});
        }
        res.status(500).json({ message: "Erro não especificado." });
    }
}

export async function create(req: Request, res: Response) {
    try {
        const newBook = await authorService.create(req.body);
        return res.status(201).json(serializeBigInt(newBook));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const updatedBook = await authorService.update(req.params.id, req.body);
        return res.status(200).json(serializeBigInt(updatedBook));
    } catch (err) {
        if (err.message == "Autor não encontrado.") {
            res.status(404).json({message: err.message});
        }
        res.status(500).json({ message: err.message });
    }
}

export async function deleteById(req: Request, res: Response) {
    try {
        const deletedBook = await authorService.deleteById(req.params.id);
        res.status(204).json(serializeBigInt(deletedBook));
    }   catch (err){
        if (err.message == "Autor não encontrado.") {
            res.status(404).json({message: err.message});
        }
        res.status(500).json({message: err.message})
    }
}