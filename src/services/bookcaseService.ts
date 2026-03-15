import { z } from "zod";
import { createBookcaseSchema, updateBookcaseSchema } from "../schemas/bookcaseSchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateBookcaseDTO = z.infer<typeof createBookcaseSchema>;
type UpdateBookcaseDTO = z.infer<typeof updateBookcaseSchema>;

const repository = prisma;

export async function getAll() {
    return repository.bookcase.findMany();
}

export async function getById(bookcaseIds: string | string[]) {
    const bookcaseId = returnNumberedID(bookcaseIds);

    if (!bookcaseId) {
        throw new AppError("ID da Prateleira inválido.", HTTPCODES.BADREQUEST);
    }

    const bookcase = await prisma.bookcase.findUnique({where: {id_bookcase: bookcaseId}});

    if (!bookcase) {
        throw new AppError("Prateleira não encontrada.", HTTPCODES.NOTFOUND);
    }

    return bookcase;
}

export async function create(body: CreateBookcaseDTO) {
    const sectorExists = await prisma.sector.findUnique({ where: { id_sector: body.sector } });

    if (!sectorExists) {
        throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
    }

    const alreadyExists = await prisma.bookcase.findFirst({where: {name: body.name}});

    if (alreadyExists) {
        throw new AppError("Uma Prateleira já existe com esse nome", HTTPCODES.BADREQUEST);
    }

    return repository.bookcase.create({
        data: {
            ...body,
            sector: {
                connect: { id_sector: body.sector }
            }
        }
    });
}

export async function update(bookcaseIds: string | string[], body: UpdateBookcaseDTO) {
    const { sector, ...rest } = body
    const bookcaseId = returnNumberedID(bookcaseIds);
    const sectorId = body.sector;

    if (!bookcaseId) {
        throw new AppError("ID da Prateleira inválido.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await prisma.bookcase.findFirst({where: {name: body.name as string}});

    if (alreadyExists && Number(alreadyExists.id_bookcase) !== bookcaseId) {
        throw new AppError("Uma Prateleira já existe com esse nome", HTTPCODES.BADREQUEST);
    }

    const bookcase = await prisma.bookcase.findUnique({where: {id_bookcase: bookcaseId}});

    if (!bookcase) {
        throw new AppError("Prateleira não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.bookcase.update({
        where: {id_bookcase: bookcaseId},
        data: {
            ...rest,
            ...(sectorId && { sector: { connect: { id_sector: sectorId } } })
        }
    });
}

export async function deleteById(bookcaseIds: string | string[]) {
    const bookcaseId = returnNumberedID(bookcaseIds);

    if (!bookcaseId) {
        throw new AppError("ID da Prateleira inválido.", HTTPCODES.BADREQUEST);
    }

    const bookcaseExists = await prisma.bookcase.findUnique({where: {id_bookcase: bookcaseId}});

    if (!bookcaseExists) {
        throw new AppError("Prateleira não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.bookcase.delete({where: {id_bookcase: bookcaseId}});
}