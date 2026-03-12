import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

const repository = prisma;

export async function getAll() {
    return repository.sub_Category.findMany();
}

export async function getById(subCategoryIdS: string | string[]) {
    const subCategoryId = Number(Array.isArray(subCategoryIdS) ? subCategoryIdS[0] : subCategoryIdS);

    if (!subCategoryId) {
        throw new AppError("ID da Sub-Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const subCategory = await repository.sub_Category.findUnique({where: {id_sub_category: subCategoryId}});

    if (!subCategory) {
        throw new AppError("Sub-Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return subCategory;
}

export async function create(body: Prisma.Sub_CategoryCreateInput) {
    if (body.id_sub_category) {
        delete body.id_sub_category;
    }

    if (!body.name) {
        throw new AppError("O nome da Sub-Categoria está faltando.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await repository.sub_Category.findFirst({
        where: { name: body.name }
    });

    if (alreadyExists) {
        throw new AppError("Sub-Categoria já existe.", HTTPCODES.BADREQUEST);
    }

    return repository.sub_Category.create({data: body});
}

export async function update(subCategoryIdS: string | string[] ,body: Prisma.Sub_CategoryCreateInput) {
    const subCategoryId = Number(Array.isArray(subCategoryIdS) ? subCategoryIdS[0] : subCategoryIdS);

    if (body.id_sub_category) {
        delete body.id_sub_category;
    }

    if (!subCategoryId) {
        throw new AppError("ID da Sub-Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const subCategory = await repository.sub_Category.findUnique({where: {id_sub_category: subCategoryId}});

    if (!subCategory) {
        throw new AppError("Sub-Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.sub_Category.update({where: {id_sub_category: subCategoryId}, data: body});
}

export async function deleteById(subCategoryIdS: string | string[]) {
    const subCategoryId = Number(Array.isArray(subCategoryIdS) ? subCategoryIdS[0] : subCategoryIdS);

    if (!subCategoryId) {
        throw new AppError("ID da Sub-Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const subCategory = await repository.sub_Category.findUnique({where: {id_sub_category: subCategoryId}});

    if (!subCategory) {
        throw new AppError("Sub-Categoria não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.sub_Category.delete({where: {id_sub_category: subCategoryId}});
}