import prisma from "../database"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event: any) => {
    if (event.method === 'POST') {
        const body = await readBody(event);

        if (!body.author || !body.content) {
            throw createError({ statusCode: 400, statusMessage: "Author and content are required" });
        }

        // Get user from auth token
        const token = getHeader(event, 'authorization')?.split(' ')[1];
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Authentication required" });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
            userId = decoded.userId;
        } catch {
            throw createError({ statusCode: 401, statusMessage: "Invalid token" });
        }

        // Create or find author
        let author = await prisma.author.findFirst({
            where: { name: body.author }
        });
        
        if (!author) {
            author = await prisma.author.create({
                data: {
                    name: body.author
                }
            });
        }
        
        // Create or find default source
        let sourceId = 1; // Default source
        if (body.source) {
            // Try to find existing source or create new one
            let source = await prisma.source.findFirst({
                where: { title: body.source }
            });
            
            if (!source) {
                source = await prisma.source.create({
                    data: {
                        title: body.source
                    }
                });
            }
            sourceId = source.id;
        } else {
            // Ensure default source exists
            let defaultSource = await prisma.source.findFirst({ where: { id: 1 } });
            if (!defaultSource) {
                defaultSource = await prisma.source.create({
                    data: {
                        id: 1,
                        title: 'General'
                    }
                });
            }
        }

        const newPost = await prisma.post.create({
            data: {
                authorId: author.id,
                content: body.content,
                sourceInfo: body.additionalInfo || null,
                sourceId: sourceId,
                creatorId: userId,
                published: true
            },
            include: {
                author: true,
                source: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return newPost;
    }

    if (event.method === 'PUT') {
        const body = await readBody(event);

        if (!body.id || !body.author || !body.content) {
            throw createError({ statusCode: 400, statusMessage: "ID, author and content are required" });
        }

        // Get user from auth token
        const token = getHeader(event, 'authorization')?.split(' ')[1];
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: "Authentication required" });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
            userId = decoded.userId;
        } catch {
            throw createError({ statusCode: 401, statusMessage: "Invalid token" });
        }

        // Check if the post exists and belongs to the user
        const existingPost = await prisma.post.findUnique({
            where: { id: body.id }
        });

        if (!existingPost) {
            throw createError({ statusCode: 404, statusMessage: "Quote not found" });
        }

        if (existingPost.creatorId !== userId) {
            throw createError({ statusCode: 403, statusMessage: "You can only edit your own quotes" });
        }

        // Handle author updates
        let author = await prisma.author.findFirst({
            where: { name: body.author }
        });
        
        if (!author) {
            author = await prisma.author.create({
                data: {
                    name: body.author
                }
            });
        }
        
        // Handle source updates
        let sourceId = existingPost.sourceId;
        if (body.source) {
            let source = await prisma.source.findFirst({
                where: { title: body.source }
            });
            
            if (!source) {
                source = await prisma.source.create({
                    data: {
                        title: body.source
                    }
                });
            }
            sourceId = source.id;
        }

        const updatedPost = await prisma.post.update({
            where: { id: body.id },
            data: {
                authorId: author.id,
                content: body.content,
                sourceInfo: body.additionalInfo || null,
                sourceId: sourceId
            },
            include: {
                author: true,
                source: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return updatedPost;
    }

    // GET request - return all posts with related data
    return await prisma.post.findMany({
        include: {
            author: true,
            source: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    })
})
