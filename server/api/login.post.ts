import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.email || !body.password) {
        throw createError({ statusCode: 400, statusMessage: "Brak danych logowania" });
    }

    const user = await prisma.user.findUnique({
        where: { email: body.email },
    });

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: "Nieprawidłowe dane logowania" });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
        throw createError({ statusCode: 401, statusMessage: "Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name } };
});
