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

export async function getAllBookcasesInSectorById(sectorIds: string | string[]) {
    const sectorId = returnNumberedID(sectorIds);

    if (!sectorId) {
        throw new AppError("ID do Setor inválido.", HTTPCODES.BADREQUEST);
    }

    const sector = await prisma.sector.findUnique({where: {id_sector: sectorId}});

    if (!sector) {
        throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.bookcase.findMany({where: {fk_sector_id: sectorId}});
}

export async function create(body: CreateSectorDTO) {
    const { category, institution, ...rest } = body;

    return repository.$transaction(async (tx) => {
        const categoryExists = await tx.category.findUnique({ where: { id_category: category } });

        if (!categoryExists) {
            throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
        }

        const institutionExists = await tx.institution.findUnique({ where: { id_institution: institution } });

        if (!institutionExists) {
            throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
        }

        const alreadyExists = await tx.sector.findFirst({
            where: {
                fk_institution_id: institution,
                OR: [{ name: body.name }, { letter: body.letter }]
            }
        });

        if (alreadyExists) {
            throw new AppError("Um Setor já existe com esse nome ou letra nessa Instituição.", HTTPCODES.BADREQUEST);
        }

        return tx.sector.create({
            data: {
                ...rest,
                category: { connect: { id_category: category } },
                institution: { connect: { id_institution: institution } }
            }
        });
    });
}

export async function update(sectorIds: string | string[], body: UpdateSectorDTO) {
    const { category, institution, ...rest } = body;
    const sectorId = returnNumberedID(sectorIds);

    if (!sectorId) {
        throw new AppError("ID do Setor inválido.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const sector = await tx.sector.findUnique({ where: { id_sector: sectorId } });

        if (!sector) {
            throw new AppError("Setor não encontrado.", HTTPCODES.NOTFOUND);
        }

        const institutionId = institution ?? Number(sector.fk_institution_id);

        const alreadyExists = await tx.sector.findFirst({
            where: {
                fk_institution_id: institutionId,
                OR: [
                    ...(body.name ? [{ name: body.name }] : []),
                    ...(body.letter ? [{ letter: body.letter }] : []),
                ],
                NOT: { id_sector: sectorId }
            }
        });

        if (alreadyExists) {
            throw new AppError("Um Setor já existe com esse nome ou letra nessa Instituição.", HTTPCODES.BADREQUEST);
        }

        if (category) {
            const categoryExists = await tx.category.findUnique({ where: { id_category: category } });

            if (!categoryExists) {
                throw new AppError("Categoria não encontrada.", HTTPCODES.NOTFOUND);
            }
        }

        if (institution) {
            const institutionExists = await tx.institution.findUnique({ where: { id_institution: institution } });

            if (!institutionExists) {
                throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
            }
        }

        return tx.sector.update({
            where: { id_sector: sectorId },
            data: {
                ...rest,
                ...(category && { category: { connect: { id_category: category } } }),
                ...(institution && { institution: { connect: { id_institution: institution } } })
            }
        });
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