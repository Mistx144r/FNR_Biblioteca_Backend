import { z } from "zod";

export const createInstitutionSchema = z.object({
    name: z.string().min(1)
});

export const updateInstitutionSchema = createInstitutionSchema.partial();