import { createClient, RedisClientType } from 'redis';
import { env } from "../schemas/envSchema";
import logger from "./logger";

const globalForRedis = globalThis as unknown as { redis: RedisClientType };

export const redis = globalForRedis.redis ?? (() => {
    const client = createClient({
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        socket: {
            host: env.REDIS_HOST,
            port: Number(env.REDIS_PORT)
        }
    });

    client.connect().then(() => logger.info("Redis Conectado!"));
    return client;
})();
redis.on('error', err => logger.error('Redis Client Error', err));

if (env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
