import { PrismaClient, Prisma } from "@prisma/client";

const repository = new PrismaClient();

// Talvez Adicionar Uma Paginação
export async function getAll() {
    return repository.author.findMany();
}

export async function getById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const author = await repository.author.findUnique({where: {id_author: id}});

    if (!author) {
        throw new Error("Autor não encontrado.");
    }

    return author;
}

export async function create(body: Prisma.AuthorCreateInput) {
    if (!body.name) {
        throw new Error("O nome do Autor está faltando.")
    }

    return repository.author.create({data: body});
}

export async function update(idS: string | string[], body: Prisma.AuthorUpdateInput) {
    if (body.id_author) {
        delete body.id_author;
    }

    if (!body.name) {
        throw new Error("O nome do Autor está faltando.")
    }

    const id = Number(idS);
    
    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const author = await repository.author.findUnique({where: {id_author: id}});
    
    if (!author) {
        throw new Error("Autor não encontrado.")
    }
    
    return repository.author.update({where: {id_author: id}, data: body});
}

export async function deleteById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const author = await repository.author.findUnique({where: {id_author: id}});

    if (!author) {
        throw new Error("Autor não encontrado.")
    }

    return repository.author.delete({where: {id_author: id}})
}