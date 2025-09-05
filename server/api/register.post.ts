import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { defineEventHandler, createError } from 'h3'
import { redis } from '~/server/utils/redis'
import prisma from '~/server/database';

export default defineEventHandler(async (event: any) => {
    try {
        console.log('Register API called');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Database URL exists:', !!process.env.DATABASE_URL);
        console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
        
        await incrementRegisterCounter(event)

    const body = await readBody(event);

    if (!body.email || !body.password || !body.name) {
        throw createError({ statusCode: 400, statusMessage: "Brak wymaganych danych" });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    });

    if (existingUser) {
        throw createError({ statusCode: 401, statusMessage: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: hashedPassword,
        },
    });

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { 
        message: "Konto utworzone", 
        token, 
        user: { id: user.id, email: user.email, name: user.name } 
    };
    
    } catch (error) {
        console.error('Register API Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            statusCode: error.statusCode
        });
        throw error;
    }
});

const incrementRegisterCounter = async (event: any) => {
    const ip = getRequestIP(event)
    const key = `register:${ip}`

    const attempts = await redis.get<number>(key) || 0

    if (attempts >= 2) {
        throw createError({ statusCode: 429, statusMessage: 'Too many registrations from this IP' });
    }

    await redis.incr(key)
    await redis.expire(key, 60 * 60) // 1 godzina

    return { success: true }
}

function getRequestIP(event: any) {
    return (
        event.node.req.headers['x-forwarded-for'] || event.node.req.connection.remoteAddress || 'unknown'
    )
}
