import { redis } from "./redis";
import { env } from "../schemas/envSchema";
import { timingSafeEqual } from "crypto"

export async function storeWorkerRefreshJWT(workerId: number, userJWT: string, ttl?: number) {
    const expiry = ttl ?? Number(env.REFRESHEXPIRETIMEINSECONDS);
    const key = `${env.NODE_ENV}:${workerId}:refresh`;

    return redis.multi()
        .del(key)
        .set(key, userJWT)
        .expire(key, expiry)
        .exec();
}

export async function isWorkerRefreshTokenValid(workerId: number, browserRefreshToken: string) {
    const stored = await redis.get(`${env.NODE_ENV}:${workerId}:refresh`);
    if (!stored) return false;

    return timingSafeEqual(
        Buffer.from(stored),
        Buffer.from(browserRefreshToken)
    );
}

export async function revokeWorkerTokens(workerId: number) {
    return await redis.del(`${env.NODE_ENV}:${workerId}:refresh`);
}