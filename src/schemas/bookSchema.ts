import { z } from "zod";

export const createBookSchema = z.object({
    name: z.string().min(6),
    isbn: z.string().regex(/^(\d{10}|\d{13})$/),
    description: z.string(),
    publisher: z.string(),
    language: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
    category: z.number().positive(),
    edition: z.number().positive(),
    pages: z.number().positive(),
    bookcover: z.url(),
    published_at: z.string()
});

export const updateBookSchema = createBookSchema.partial();