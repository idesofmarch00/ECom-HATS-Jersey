const Redis = require('ioredis');

let redis = null;

function getRedisClient() {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });

  redis.on('error', (err) => {
    console.warn('⚠️  Redis connection error (non-fatal, caching disabled):', err.message);
  });

  // Attempt connection but don't block the app if Redis is unavailable
  redis.connect().catch((err) => {
    console.warn('⚠️  Redis unavailable — app will run without caching:', err.message);
    redis = null;
  });

  return redis;
}

// Cache helpers with graceful fallback
async function cacheGet(key) {
  try {
    const client = getRedisClient();
    if (!client) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 300) {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Silently fail — caching is a nice-to-have
  }
}

async function cacheDel(key) {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.del(key);
  } catch {
    // Silently fail
  }
}

async function cacheDelPattern(pattern) {
  try {
    const client = getRedisClient();
    if (!client) return;
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch {
    // Silently fail
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel, cacheDelPattern };
