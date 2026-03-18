import { z } from "zod";

export const createBookcaseSchema = z.object({
    name: z.string().min(1),
    sector: z.coerce.number().positive()
});

export const updateBookcaseSchema = createBookcaseSchema.partial();