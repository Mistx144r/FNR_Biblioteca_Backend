import { redis } from "./redis";

export function storeWorkerJWT(userId: number, userJWT: string) {
    return redis.multi().set(`${process.env.NODE_ENV}:${userId}:data`, userJWT).expire(`${process.env.NODE_ENV}:${userId}:data`, 28800).exec();
}