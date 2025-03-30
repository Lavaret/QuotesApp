import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
    const body = await readBody(event);

    if (!body.email || !body.password || !body.name) {
        throw createError({ statusCode: 400, statusMessage: "Brak wymaganych danych" });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    });

    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: "Użytkownik już istnieje" });
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
