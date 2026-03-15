import { z } from "zod";
import { createSectorSchema, updateSectorSchema } from "../schemas/sectorSchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateSectorDTO = z.infer<typeof createSectorSchema>;
type UpdateSectorDTO = z.infer<typeof updateSectorSchema>;

const repository = prisma;

export async function getAll() {
    return repository.sector.findMany();
}

export async function getById(sectorIds: string | string[]) {
    const sectorId = returnNumberedID(sectorIds);

    if (!sectorId) {
        throw new AppError("ID do Setor inválido.", HTTPCODES.BADREQUEST);
    }

    const sector = await prisma.sector.findUnique({where: {id_sector: sectorId}});

    if (!sector) {
        throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return sector;
}

export async function create(body: CreateSectorDTO) {
    const alreadyExists = await prisma.sector.findFirst({where: {OR: [{name: body.name}, {letter: body.letter}]}});

    if (alreadyExists) {
        throw new AppError("Um Setor já existe com esse nome ou letra.", HTTPCODES.BADREQUEST);
    }

    return repository.sector.create({
        data: {
            ...body,
            category: {
                connect: { id_category: body.category }
            }
        }
    });
}

export async function update(sectorIds: string | string[], body: UpdateSectorDTO) {
    const { category, ...rest } = body;
    const sectorId = returnNumberedID(sectorIds);
    const categoryId = body.category

    if (!sectorId) {
        throw new AppError("ID do Setor inválido.", HTTPCODES.BADREQUEST);
    }

    if (body.category !== undefined && !categoryId) {
        throw new AppError("ID da Categoria inválido.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await prisma.sector.findFirst({where: {OR: [{name: body.name}, {letter: body.letter}]}});

    if (alreadyExists && Number(alreadyExists.id_sector) !== sectorId) {
        throw new AppError("Um Setor já existe com essa letra.", HTTPCODES.BADREQUEST);
    }

    const sector = await prisma.sector.findUnique({where: {id_sector: sectorId}});

    if (!sector) {
        throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.sector.update({
        where: { id_sector: sectorId },
        data: {
            ...rest,
            ...(categoryId && { category: { connect: { id_category: categoryId } } })
        }
    });
}

export async function deleteById(sectorIdS: string | string[]) {
    const sectorId = returnNumberedID(sectorIdS);

    if (!sectorId) {
        throw new AppError("ID do Setor inválido.", HTTPCODES.BADREQUEST);
    }

    const sectorExists = await prisma.sector.findUnique({where: {id_sector: sectorId}});

    if (!sectorExists) {
        throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.sector.delete({where: {id_sector: sectorId}});
}