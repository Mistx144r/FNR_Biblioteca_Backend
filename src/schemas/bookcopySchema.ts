import { z } from "zod";
import { stateEnum } from "@prisma/client";

export const createBookCopySchema = z.object({
    book: z.number(),
    bookcase: z.number(),
    is_consult: z.boolean(),
    state: z.enum(stateEnum).optional(),
    description: z.string().optional()
});

export const updateBookCopyStateSchema = z.object({
    state: z.enum(stateEnum)
})

export const updateBookCopySchema = z.object({
    bookcase: z.number().optional(),
    description: z.string().optional()
})