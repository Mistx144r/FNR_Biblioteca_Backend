import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { z } from "zod";
import { WorkerJwtPayload } from "../types/jwt/jwt";
import { createWorkerSchema, loginWorkerSchema, updateWorkerSchema } from "../schemas/workerSchema";
import { prisma } from "../utils/prisma";
import { returnNumberedID, serializeBigInt } from "../utils/utils";
import { isWorkerRefreshTokenValid, revokeWorkerTokens, storeWorkerRefreshJWT } from "../utils/workerRedis";
import { AppError } from "../errors/AppError";
import { HTTPCODES } from "../utils/httpCodes";

type CreateWorkerDTO = z.infer<typeof createWorkerSchema>;
type UpdateWorkerDTO = z.infer<typeof updateWorkerSchema>;
type LoginWorkerDTO = z.infer<typeof loginWorkerSchema>;

const repository = prisma;

//================================
// Reminders
//================================
// 1. Talvez Adicionar Uma Verificação De Telefone.
// 2. Depois fazer um Code Review para procurar por erros.
// 3. Fazer a função de logout passando por um middleware para saber os dados do user. --Done
// 4. ...

//================================
// Utils
//================================
function isCPFValid(unverifiedCPF: string): boolean {
    const cpf = unverifiedCPF.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += Number(cpf[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    if (firstDigit !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += Number(cpf[i]) * (11 - i);
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    return secondDigit === Number(cpf[10]);
}

//================================
// Main Worker Functions
//================================
export async function getAll() {
    return prisma.worker.findMany({
        select: {
            id_worker: true,
            name: true,
            email: true,
            cpf: true,
            cellphone: true,
            telephone: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function getById(workerIdS: string | string[]) {
    const workerId = returnNumberedID(workerIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({
        where: {
            id_worker: workerId
        },

        select: {
            id_worker: true,
            name: true,
            email: true,
            cpf: true,
            cellphone: true,
            telephone: true,
            created_at: true,
            updated_at: true
        }
    });

    if (!worker) {
        throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
    }

    return worker;
}

export async function getWorkerAllInfoById(workerIdS: string | string[]) {
    const [worker, roles] = await Promise.all([
        getById(workerIdS),
        getRoles(workerIdS),
    ]);

    return {
        worker,
        roles
    }
}

export async function create(body: CreateWorkerDTO) {
    const { cpf, email, password } = body;

    const alreadyExists = await repository.worker.findFirst({where: {OR: [{cpf: cpf}, {email: email}]}});

    if (alreadyExists) {
        throw new AppError("Funcionário já existe.", HTTPCODES.BADREQUEST);
    }

    if (!isCPFValid(cpf)) {
        throw new AppError("CPF é inválido.", HTTPCODES.BADREQUEST);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);


    body = {
        ...body,
        password: String(encryptedPassword)
    }

    return repository.worker.create({data: body});
}

export async function update(workerIdS: string | string[], body: UpdateWorkerDTO) {
    const { cpf, email, password } = body;
    const workerId = returnNumberedID(workerIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({where: {id_worker: workerId}});

    if (!worker) {
        throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
    }

    const alreadyExists = await repository.worker.findFirst({where: {OR: [{ cpf }, { email }], NOT: { id_worker: workerId }}});

    if (alreadyExists) {
        throw new AppError("Um Funcionário com esses dados já existe.", HTTPCODES.BADREQUEST);
    }

    if (password) {
        const encryptedPassword = await bcrypt.hash(password, 10);

        body = {
            ...body,
            password: String(encryptedPassword)
        }
    }

    return repository.worker.update({where: {id_worker: workerId}, data: body});
}

export async function deleteById(workerIdS: string | string[]) {
    const workerId = returnNumberedID(workerIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    const worker = await repository.worker.findUnique({where: {id_worker: workerId}});

    if (!worker) {
        throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
    }

    return repository.worker.delete({where: {id_worker: workerId}});
}

//================================
// Role Functions
//================================
export async function getRoles(workerIdS: string | string[]) {
    const workerId = returnNumberedID(workerIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    const roles = await repository.worker_Roles.findMany({where: {fk_worker_id: workerId}, include: {role: true}});

    return roles.map(r => r.role);
}

export async function addRole(workerIdS: string | string[], roleIdS: string | string[]) {
    const workerId = returnNumberedID(workerIdS);
    const roleId = returnNumberedID(roleIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    if (!roleId) {
        throw new AppError("ID da role inválida.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const workerExists = await tx.worker.findUnique({where: {id_worker: workerId}});

        if (!workerExists) {
            throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
        }

        const roleExists = await tx.roles.findUnique({where: {id_roles: roleId}});

        if (!roleExists) {
            throw new AppError("Cargo não encontrado.", HTTPCODES.NOTFOUND);
        }

        const isWorkerAlreadyWithThisRole = await tx.worker_Roles.findUnique({
            where: {
                fk_role_id_fk_worker_id: {
                    fk_worker_id: workerId,
                    fk_role_id: roleId
                }
            }
        });

        if (isWorkerAlreadyWithThisRole) {
            throw new AppError("Funcionário já tem esse cargo.", HTTPCODES.BADREQUEST);
        }

        return tx.worker_Roles.create({data: {fk_worker_id: workerId, fk_role_id: roleId}});
    });
}

export async function removeRole(workerIdS: string | string[], roleIdS: string | string[]) {
    const workerId = returnNumberedID(workerIdS);
    const roleId = returnNumberedID(roleIdS);

    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    if (!roleId) {
        throw new AppError("ID da role inválida.", HTTPCODES.BADREQUEST);
    }

    return repository.$transaction(async (tx) => {
        const workerExists = await tx.worker.findUnique({where: {id_worker: workerId}});

        if (!workerExists) {
            throw new AppError("Funcionário não encontrado.", HTTPCODES.NOTFOUND);
        }

        const roleExists = await tx.roles.findUnique({where: {id_roles: roleId}});

        if (!roleExists) {
            throw new AppError("Cargo não encontrado.", HTTPCODES.NOTFOUND);
        }

        const isWorkerAlreadyWithThisRole = await tx.worker_Roles.findUnique({
            where: {
                fk_role_id_fk_worker_id: {
                    fk_worker_id: workerId,
                    fk_role_id: roleId
                }
            }
        });

        if (!isWorkerAlreadyWithThisRole) {
            throw new AppError("Funcionário não pertence a esse cargo.", HTTPCODES.BADREQUEST);
        }

        return tx.worker_Roles.delete({where: {fk_role_id_fk_worker_id: {fk_worker_id: workerId, fk_role_id: roleId}}});
    });
}

//================================
// Auth Functions
//================================
export async function login(body: LoginWorkerDTO) {
    const { email, password } = body;
    const worker = await repository.worker.findFirst({where: { email: email }, include: {Worker_Roles: {include: {role: true}}}});

    if (!worker) {
        throw new AppError("Credenciais inválidas.", HTTPCODES.UNAUTHORIZED);
    }

    const isCorrectPassword = await bcrypt.compare(password, worker.password);

    if (!isCorrectPassword) {
        throw new AppError("Credenciais inválidas.", HTTPCODES.UNAUTHORIZED);
    }

    const gotRoles = await getRoles(String(worker.id_worker));
    const organizedRoles = gotRoles.map(r => r.name);

    const accessToken = jwt.sign({
        id: serializeBigInt(worker.id_worker),
        name: worker.name,
        roles: organizedRoles
    }, String(process.env.JWTSECRETKEY), {expiresIn: "10m"});

    const refreshToken = jwt.sign({
        id: serializeBigInt(worker.id_worker),
        roles: organizedRoles
    }, String(process.env.JWTSECRETKEY), {expiresIn: "7d"});

    await storeWorkerRefreshJWT(serializeBigInt(worker.id_worker), refreshToken);

    return { accessToken, refreshToken }
}

export async function refresh(browserRefreshToken: string) {
    if (!browserRefreshToken) {
        throw new AppError("Refresh token não encontrado.", HTTPCODES.UNAUTHORIZED);
    }

    const decoded = jwt.verify(browserRefreshToken, String(process.env.JWTSECRETKEY), {algorithms: ["HS256"]}) as WorkerJwtPayload;

    if (!await isWorkerRefreshTokenValid(decoded.id, browserRefreshToken)) {
        throw new AppError("Refresh token inválido.", HTTPCODES.UNAUTHORIZED);
    }

    const ttlRestante = decoded.exp! - Math.floor(Date.now() / 1000);

    const newAccessToken = jwt.sign(
        { id: decoded.id, roles: decoded.roles },
        String(process.env.JWTSECRETKEY),
        { expiresIn: "10m" }
    );

    const newRefreshToken = jwt.sign(
        { id: decoded.id, roles: decoded.roles },
        String(process.env.JWTSECRETKEY),
        { expiresIn: ttlRestante }
    );

    await storeWorkerRefreshJWT(decoded.id, newRefreshToken, ttlRestante);

    return { newAccessToken, newRefreshToken, ttlRestante };
}

export async function logout(workerId: number | undefined) {
    if (!workerId) {
        throw new AppError("ID do Funcionário inválido.", HTTPCODES.BADREQUEST);
    }

    return await revokeWorkerTokens(workerId);
}