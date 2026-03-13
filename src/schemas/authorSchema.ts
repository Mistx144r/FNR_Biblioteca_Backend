import { z } from "zod";

export const createAuthorSchema = z.object({
    name: z.string()
});

export const updateAuthorSchema = createAuthorSchema.partial();