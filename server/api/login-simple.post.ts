import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
    try {
        console.log('Simple Login API called');
        console.log('Environment variables check:', {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
            JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0
        });
        
        // Validate required environment variables first
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            throw createError({ statusCode: 500, statusMessage: "JWT_SECRET configuration missing" });
        }
        
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is not set');
            throw createError({ statusCode: 500, statusMessage: "DATABASE_URL configuration missing" });
        }

        const body = await readBody(event);
        console.log('Request body received:', { email: body.email, hasPassword: !!body.password });

        if (!body.email || !body.password) {
            throw createError({ statusCode: 400, statusMessage: "Email and password are required" });
        }

        console.log('Attempting to find user:', body.email);
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user) {
            console.log('User not found for email:', body.email);
            throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
        }

        console.log('User found, checking password...');
        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
            console.log('Password mismatch for user:', body.email);
            throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
        }

        console.log('Password verified, generating token...');
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful for user:', body.email);
        return { 
            token, 
            user: { id: user.id, email: user.email, name: user.name },
            success: true 
        };
        
    } catch (error) {
        console.error('Simple Login API Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            statusCode: error.statusCode
        });
        
        // If it's already a createError, rethrow it
        if (error.statusCode) {
            throw error;
        }
        
        // Otherwise wrap in a 500 error
        throw createError({ 
            statusCode: 500, 
            statusMessage: "Internal server error: " + error.message 
        });
    }
});
