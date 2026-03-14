import { createClient, RedisClientType } from 'redis';
import logger from "./logger";

const globalForRedis = globalThis as unknown as { redis: RedisClientType };

export const redis = globalForRedis.redis ?? (() => {
    const client = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        }
    });

    client.connect().then(() => logger.info("Redis Conectado!"));
    return client;
})();
redis.on('error', err => logger.error('Redis Client Error', err));

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
