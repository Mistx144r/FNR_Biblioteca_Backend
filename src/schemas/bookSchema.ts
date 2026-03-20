import { z } from "zod";

export const createBookSchema = z.object({
  name: z.string().min(6),
  isbn: z.string().regex(/^(\d{10}|\d{13})$/),
  description: z.string(),
  publisher: z.string(),
  language: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
  category: z.coerce.number().positive(),
  edition: z.coerce.number().positive(),
  pages: z.coerce.number().positive(),
  bookcover: z.url(),
  published_at: z.coerce.date(),
});

export const bookFilterSchema = z
  .object({
    name: z.string().min(1),
    isbn: z.string().min(1),
    language: z.string().min(1).max(5),
    category: z.coerce.number().positive(),
    edition: z.coerce.number().positive(),
    published_at: z.coerce.date(),
  })
  .partial();

export const updateBookSchema = createBookSchema.partial();
