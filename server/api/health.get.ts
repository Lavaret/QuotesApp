export default defineEventHandler(async (event) => {
    try {
        // Check environment variables (without exposing sensitive data)
        const envCheck = {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
            REDIS_URL_EXISTS: !!process.env.UPSTASH_REDIS_REST_URL,
            REDIS_TOKEN_EXISTS: !!process.env.UPSTASH_REDIS_REST_TOKEN,
            DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...',
            DATABASE_URL_SUFFIX: process.env.DATABASE_URL?.slice(-10),
            DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
            DATABASE_URL_CONTAINS_ACCELERATE: process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') || false,
            DATABASE_URL_CONTAINS_API_KEY: process.env.DATABASE_URL?.includes('api_key=') || false,
            JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
        };

        console.log('Health check:', envCheck);

        // Test database connection
        let dbStatus = 'unknown';
        try {
            const { default: prisma } = await import('~/server/database');
            await prisma.$queryRaw`SELECT 1`;
            dbStatus = 'connected';
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            dbStatus = 'error: ' + dbError.message;
        }

        // Test Redis connection
        let redisStatus = 'unknown';
        try {
            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                const { redis } = await import('~/server/utils/redis');
                await redis.ping();
                redisStatus = 'connected';
            } else {
                redisStatus = 'no credentials';
            }
        } catch (redisError) {
            console.error('Redis connection error:', redisError);
            redisStatus = 'error: ' + redisError.message;
        }

        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: envCheck,
            connections: {
                database: dbStatus,
                redis: redisStatus
            }
        };
    } catch (error) {
        console.error('Health check error:', error);
        
        throw createError({
            statusCode: 500,
            statusMessage: 'Health check failed: ' + error.message
        });
    }
});
