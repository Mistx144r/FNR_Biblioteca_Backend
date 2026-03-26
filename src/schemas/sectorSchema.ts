import { z } from "zod";

export const createSectorSchema = z.object({
    name: z.string().min(1),
    letter: z.string().min(1).max(1),
    category: z.coerce.number().positive(),
    institution: z.number().positive()
});

export const updateSectorSchema = createSectorSchema.partial();