import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { defineEventHandler, createError } from 'h3'
import { redis } from '~/server/utils/redis'

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
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

    return { message: "Konto utworzone", userId: user.id };
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
