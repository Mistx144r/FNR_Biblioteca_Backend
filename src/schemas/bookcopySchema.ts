import { z } from "zod";
import { stateEnum } from "@prisma/client";

export const createBookCopySchema = z.object({
    book: z.coerce.number().positive(),
    bookcase: z.coerce.number().positive(),
    institution: z.coerce.number().positive(),
    is_consult: z.boolean(),
    is_virtual: z.boolean().optional(),
    state: z.enum(stateEnum).optional(),
    description: z.string().optional()
});

export const updateBookCopyStateSchema = z.object({
    state: z.enum(stateEnum)
});

export const updateBookCopySchema = z.object({
    bookcase: z.number().positive(),
    institution: z.number().positive(),
    description: z.string(),
}).partial();