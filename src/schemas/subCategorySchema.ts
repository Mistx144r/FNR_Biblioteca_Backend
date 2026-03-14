import { z } from "zod";

export const createSubCategorySchema = z.object({
    name: z.string().min(1)
});

export const updateSubCategorySchema = createSubCategorySchema.partial();