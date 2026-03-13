import { z } from "zod";

export const createBookSchema = z.object({
    name: z.string(),
    isbn: z.string(),
    description: z.string(),
    publisher: z.string(),
    language: z.string(),
    category: z.number(),
    edition: z.number(),
    pages: z.number(),
    bookcover: z.url(),
    published_at: z.string()
});

export const updateBookSchema = createBookSchema.partial();