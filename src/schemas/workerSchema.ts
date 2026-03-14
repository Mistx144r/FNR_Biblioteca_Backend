import { z } from "zod";

export const createWorkerSchema = z.object({
    name: z.string().min(4),
    email: z.email(),
    password: z.string().min(8).max(32),
    cpf: z.string().regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/),
    cellphone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/).min(11),
    telephone: z.string().regex(/^\d{4}-\d{4}$/).min(8).optional()
});

export const loginWorkerSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(32)
})

export const updateWorkerSchema = createWorkerSchema.partial();