import { z } from "zod";
import { createInstitutionSchema, updateInstitutionSchema } from "../schemas/institutionSchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateInstitutionDTO = z.infer<typeof createInstitutionSchema>;
type UpdateInstitutionDTO = z.infer<typeof updateInstitutionSchema>;

const repository = prisma;

export async function getAll() {
    return repository.institution.findMany();
}

export async function getById(institutionIdS: string | string[]) {
    const institutionId = returnNumberedID(institutionIdS);

    if (!institutionId) {
        throw new AppError("ID da Instituição inválido.", HTTPCODES.BADREQUEST);
    }

    const institution = await prisma.institution.findUnique({ where: { id_institution: institutionId } });

    if (!institution) {
        throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
    }

    return institution;
}

export async function getAllInstitutionSectorsById(institutionIdS: string | string[]) {
    const institutionId = returnNumberedID(institutionIdS);

    if (!institutionId) {
        throw new AppError("ID da Instituição inválido.", HTTPCODES.BADREQUEST);
    }

    const institution = await prisma.institution.findUnique({ where: { id_institution: institutionId } });

    if (!institution) {
        throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
    }

    return prisma.sector.findMany({where: {fk_institution_id: institutionId}});
}

export async function create(body: CreateInstitutionDTO) {
    const alreadyExists = await prisma.institution.findFirst({ where: { name: body.name } });

    if (alreadyExists) {
        throw new AppError("Uma Instituição já existe com esse nome.", HTTPCODES.BADREQUEST);
    }

    return repository.institution.create({ data: body });
}

export async function update(institutionIdS: string | string[], body: UpdateInstitutionDTO) {
    const { name } = body;
    const institutionId = returnNumberedID(institutionIdS);

    if (!institutionId) {
        throw new AppError("ID da Instituição inválido.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await prisma.institution.findFirst({ where: { name: name as string } });

    if (alreadyExists && Number(alreadyExists.id_institution) !== institutionId) {
        throw new AppError("Uma Instituição já existe com esse nome.", HTTPCODES.BADREQUEST);
    }

    const institution = await prisma.institution.findUnique({ where: { id_institution: institutionId } });

    if (!institution) {
        throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.institution.update({ where: { id_institution: institutionId }, data: body });
}

export async function deleteById(institutionIdS: string | string[]) {
    const institutionId = returnNumberedID(institutionIdS);

    if (!institutionId) {
        throw new AppError("ID da Instituição inválido.", HTTPCODES.BADREQUEST);
    }

    const institution = await prisma.institution.findUnique({ where: { id_institution: institutionId } });

    if (!institution) {
        throw new AppError("Instituição não encontrada.", HTTPCODES.NOTFOUND);
    }

    return repository.institution.delete({ where: { id_institution: institutionId } });
}