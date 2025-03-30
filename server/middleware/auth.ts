import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const token = getHeader(event, 'authorization')?.split(' ')[1];

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Brak tokena" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        event.context.auth = decoded;
    } catch {
        throw createError({ statusCode: 401, statusMessage: "Nieprawidłowy token" });
    }
});
