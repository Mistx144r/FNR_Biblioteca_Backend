import {Prisma} from "@prisma/client";
import { prisma } from "../utils/prisma";

const repository = prisma;

// Fazer uma revisao completa aqui
export async function getAll(pageS: string = "1", limitS: string = "10") {
    const page = Number(pageS);
    const limit = Number(limitS);

    if (!page) {
        throw new Error("O valor enviado pela página não é um número ou é menor ou igual a 0.");
    }

    if (!limit) {
        throw new Error("O valor enviado pelo limite não é um número ou é menor ou igual a 0.");
    }

    const skip = (page - 1) * limit;

    const [workers, total] = await Promise.all([
        repository.worker.findMany({
            skip,
            take: limit,
            orderBy: { id_worker: "asc" }
        }),
        repository.worker.count()
    ]);

    return {
        data: workers,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        }
    };
}

export async function getById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const worker = await repository.worker.findUnique({where: {id_worker: (id)}});

    if (!worker) {
        throw new Error("Bibliotecário não encontrado.");
    }

    return worker;
}

export async function create(body: Prisma.WorkerCreateInput){
    const { name, cpf, email, cellphone } = body;

    if (!name || !cpf || !email || !cellphone ) {
        throw new  Error("Dados insuficientes para registro do funcionário.")
    }

    return repository.worker.create({data: body});
}

export async function update(idS: string | string[], body: Prisma.WorkerUpdateInput) {
    const { name, cpf, email, cellphone } = body;

    if (!name || !cpf || !email || !cellphone ) {
        throw new Error("Dados insuficientes para atualização do funcionário.")
    }

    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const worker = await repository.worker.findUnique({where: {id_worker: id}});

    if (!worker) {
        throw new Error("Funcionário não encontrado!")
    }

    return repository.worker.update({where: {id_worker: id}, data: body});
}

export async function deleteById(idS: string | string[]) {
    const id = Number(idS);

    if (!id) {
        throw new Error("O valor do ID não é um número ou é menor ou igual a 0.");
    }

    const worker = await repository.worker.findUnique({where: {id_worker: id}});

    if (!worker) {
        throw new Error("Funcionário não encontrado!")
    }

    return repository.worker.delete({where: {id_worker: id}})
}