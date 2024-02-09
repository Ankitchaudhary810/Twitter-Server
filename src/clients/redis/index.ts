import Redis from "ioredis";

export const redisClient = new Redis(
  "redis://default:20b54bb2c6e64733ae8b35935532d443@us1-mature-kiwi-38428.upstash.io:38428"
);
