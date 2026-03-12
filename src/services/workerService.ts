import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

const repository = prisma;

// Worker Main Functions

export async function getAll() {
    return repository.worker.findMany();
}

export async function getById(workerIdS: string | string[]) {
    const workerId = Number(Array.isArray(workerIdS) ? workerIdS[0] : workerIdS);

    if (!workerId) {
        throw new AppError("ID do Bibliotecário(a) é inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({where: {id_worker: (workerId)}});

    if (!worker) {
        throw new AppError("Bibliotecário(a) não encontrado.", HTTPCODES.NOTFOUND);
    }

    return worker;
}

export async function create(body: Prisma.WorkerCreateInput){
    const { name, cpf, email, cellphone } = body;

    if (body.id_worker) {
        delete body.id_worker;
    }

    if (!name || !cpf || !email || !cellphone) {
        throw new AppError("Dados insuficientes para registro do funcionário.", HTTPCODES.BADREQUEST);
    }

    const workerAlreadyWithCPFOrEmail = await repository.worker.findFirst({
        where: {
            OR: [
                { cpf: cpf as string },
                { email: email as string }
            ]
        }
    });

    if (workerAlreadyWithCPFOrEmail) {
        throw new AppError("Já existe um funcionário com esse CPF ou Email.", HTTPCODES.BADREQUEST);
    }

    return repository.worker.create({ data: body });
}

export async function update(workerIdS: string | string[], body: Prisma.WorkerUpdateInput) {
    const workerId = Number(Array.isArray(workerIdS) ? workerIdS[0] : workerIdS);

    if (body.id_worker) {
        delete body.id_worker;
    }

    if (!workerId) {
        throw new AppError("ID do Bibliotecário(a) é inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({where: {id_worker: workerId}});

    if (!worker) {
        throw new Error("Funcionário não encontrado!")
    }

    const workerAlreadyWithCPFOrEmail = await repository.worker.findFirst({
        where: {
            OR: [
                { cpf: body.cpf as string },
                { email: body.email as string }
            ]
        }
    });

    if (workerAlreadyWithCPFOrEmail) {
        throw new AppError("Já existe um funcionário com esse CPF ou Email.", HTTPCODES.BADREQUEST);
    }

    return repository.worker.update({where: {id_worker: workerId}, data: body});
}

export async function deleteById(workerIdS: string | string[]) {
    const workerId = Number(Array.isArray(workerIdS) ? workerIdS[0] : workerIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({where: {id_worker: workerId}});

    if (!worker) {
        throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.worker.delete({where: {id_worker: workerId}});
}

// Worker Role Functions