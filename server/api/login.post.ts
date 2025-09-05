import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
    try {
        console.log('Login API called');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Database URL exists:', !!process.env.DATABASE_URL);
        console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
        
        // Validate required environment variables
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            throw createError({ statusCode: 500, statusMessage: "Server configuration error" });
        }
        
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is not set');
            throw createError({ statusCode: 500, statusMessage: "Database configuration error" });
        }
        
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
    
    } catch (error) {
        console.error('Login API Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            statusCode: error.statusCode
        });
        throw error;
    }
});
