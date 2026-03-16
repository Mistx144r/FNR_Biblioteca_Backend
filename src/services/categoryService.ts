import { z } from "zod";
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils"
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;

const repository = prisma;

export async function getAll() {
    return repository.category.findMany();
}

export async function getById(categoryIdS: string | string[]) {
    const categoryId = returnNumberedID(categoryIdS);

    if (!categoryId) {
       throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const category = await prisma.category.findUnique({where: {id_category: categoryId}});

    if (!category) {
        throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return category;
}

export async function create(body: CreateCategoryDTO) {
    const alreadyExists = await prisma.category.findFirst({where: {name: body.name}});

    if (alreadyExists) {
        throw new AppError("Uma Categoria já existe com esse nome", HTTPCODES.BADREQUEST);
    }

    return repository.category.create({data: body});
}

export async function update(categoryIdS: string | string[], body: UpdateCategoryDTO) {
    const { name } = body;
    const categoryId = returnNumberedID(categoryIdS);

    if (!categoryId) {
        throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await prisma.category.findFirst({where: {name: name as string,}});

    if (alreadyExists && Number(alreadyExists.id_category) !== categoryId) {
        throw new AppError("Uma Categoria já existe com esse nome", HTTPCODES.BADREQUEST);
    }

    const category = await prisma.category.findUnique({where: {id_category: categoryId}});

    if (!category) {
        throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.category.update({where: {id_category: categoryId}, data: body});
}

export async function deleteById(categoryIdS: string | string[]) {
    const categoryId = returnNumberedID(categoryIdS);

    if (!categoryId) {
        throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const doesCategoryExists = await prisma.category.findUnique({where: {id_category: categoryId}});

    if (!doesCategoryExists) {
        throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.category.delete({where: {id_category: categoryId}});
}