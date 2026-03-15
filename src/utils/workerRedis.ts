import { redis } from "./redis";

export async function storeWorkerRefreshJWT(workerId: number, userJWT: string, ttl?: number) {
    const expiry = ttl ?? Number(process.env.REFRESHEXPIRETIMEINSECONDS);
    const key = `${process.env.NODE_ENV}:${workerId}:refresh`;

    return redis.multi()
        .del(key)
        .set(key, userJWT)
        .expire(key, expiry)
        .exec();
}

export async function isWorkerRefreshTokenValid(workerId: number, browserRefreshToken: string) {
    return (await redis.get(`${process.env.NODE_ENV}:${workerId}:refresh`) === browserRefreshToken);
}

export async function revokeWorkerTokens(workerId: number) {
    return await redis.del(`${process.env.NODE_ENV}:${workerId}:refresh`);
}