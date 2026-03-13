import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string()
});

export const updateCategorySchema = createCategorySchema.partial();