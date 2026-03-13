import { z } from "zod";

export const createSubCategorySchema = z.object({
    name: z.string()
});

export const updateSubCategorySchema = createSubCategorySchema.partial();