import { redis } from "./redis";

export function storeWorkerRefreshJWT(workerId: number, userJWT: string) {
    return redis.multi()
        .set(`${process.env.NODE_ENV}:${workerId}:refresh`, userJWT)
        .expire(`${process.env.NODE_ENV}:${workerId}:refresh`, Number(process.env.REFRESHEXPIRETIMEINSECONDS))
        .exec();
}

export async function isWorkerRefreshTokenValid(workerId: number, browserRefreshToken: string) {
    return (await redis.get(`${process.env.NODE_ENV}:${workerId}:refresh`) === browserRefreshToken);
}

export async function revokeWorkerTokens(workerId: number) {
    return await redis.del(`${process.env.NODE_ENV}:${workerId}:refresh`);
}