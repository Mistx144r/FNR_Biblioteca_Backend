import { z } from "zod";
import { createAuthorSchema, updateAuthorSchema } from "../schemas/authorSchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID } from "../utils/utils";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateAuthorDTO = z.infer<typeof createAuthorSchema>;
type UpdateAuthorDTO = z.infer<typeof updateAuthorSchema>;

const repository = prisma;

// Adicionar Paginação Aqui
export async function getAll() {
    return repository.author.findMany();
}

export async function getById(authorIdS: string | string[]) {
    const authorId = returnNumberedID(authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});

    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return author;
}

export async function create(body: CreateAuthorDTO)  {
    const alreadyExists = await repository.author.findFirst({
        where: { name: body.name }
    });

    if (alreadyExists) {
        throw new AppError("Autor já existe.", HTTPCODES.BADREQUEST);
    }

    return repository.author.create({data: body});
}

export async function update(authorIdS: string | string[], body: UpdateAuthorDTO) {
    const authorId = returnNumberedID(authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const alreadyExists = await repository.author.findFirst({where: {name: body.name}});

    if (alreadyExists && Number(alreadyExists.id_author) !== authorId) {
        throw new AppError("Autor já existe.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});
    
    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }
    
    return repository.author.update({where: {id_author: authorId}, data: body});
}

export async function deleteById(authorIdS: string | string[]) {
    const authorId = returnNumberedID(authorIdS);

    if (!authorId) {
        throw new AppError("ID do Autor inválido.", HTTPCODES.BADREQUEST);
    }

    const author = await repository.author.findUnique({where: {id_author: authorId}});

    if (!author) {
        throw new AppError("Autor não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.author.delete({where: {id_author: authorId}})
}