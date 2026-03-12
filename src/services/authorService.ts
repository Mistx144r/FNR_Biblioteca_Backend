import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

const repository = prisma;

// Adicionar Paginação Aqui
export async function getAll() {
    return repository.author.findMany();
}

export async function getById(authorIdS: string | string[]) {
    const authorId = Number(Array.isArray(authorIdS) ? authorIdS[0] : authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});

    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return author;
}

export async function create(body: Prisma.AuthorCreateInput)  {
    if (body.id_author) {
        delete body.id_author;
    }

    if (!body.name) {
        throw new Error("O nome do Autor está faltando.")
    }

    const alreadyExists = await repository.author.findFirst({
        where: { name: body.name }
    });

    if (alreadyExists) {
        throw new AppError("Autor já existe.", HTTPCODES.BADREQUEST);
    }

    return repository.author.create({data: body});
}

export async function update(authorIdS: string | string[], body: Prisma.AuthorUpdateInput) {
    if (body.id_author) {
        delete body.id_author;
    }

    if (!body.name) {
        throw new Error("O nome do Autor está faltando.")
    }

    const authorId = Number(Array.isArray(authorIdS) ? authorIdS[0] : authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});
    
    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }
    
    return repository.author.update({where: {id_author: authorId}, data: body});
}

export async function deleteById(authorIdS: string | string[]) {
    const authorId = Number(Array.isArray(authorIdS) ? authorIdS[0] : authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});

    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.author.delete({where: {id_author: authorId}})
}