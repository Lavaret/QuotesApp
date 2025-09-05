import prisma from "../database"
import { verifyAuth } from "../utils/auth"

export default defineEventHandler(async (event: any) => {
    // Check if user is authenticated (optional for filters)
    const authResult = verifyAuth(event);
    const userId = authResult.isAuthenticated ? authResult.userId : null;
    
    // Build where clause based on authentication status - same logic as in posts.ts
    const whereClause = userId ? {
        AND: [
            { is_deleted: false },  // Always exclude deleted posts
            {
                OR: [
                    { private: false },  // Show all public quotes
                    { AND: [{ private: true }, { creatorId: userId }] }  // Show private quotes only for the author
                ]
            }
        ]
    } : {
        AND: [
            { is_deleted: false },  // Always exclude deleted posts
            { private: false }  // Show only public quotes for unauthenticated users
        ]
    };

    try {
        // Get unique authors from posts that match the visibility criteria
        const authors = await prisma.author.findMany({
            where: {
                posts: {
                    some: whereClause
                }
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        posts: {
                            where: whereClause
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Get unique sources from posts that match the visibility criteria
        const sources = await prisma.source.findMany({
            where: {
                posts: {
                    some: whereClause
                }
            },
            select: {
                id: true,
                title: true,
                _count: {
                    select: {
                        posts: {
                            where: whereClause
                        }
                    }
                }
            },
            orderBy: {
                title: 'asc'
            }
        });

        return {
            authors: authors.map(author => ({
                id: author.id,
                name: author.name,
                count: author._count.posts
            })),
            sources: sources.map(source => ({
                id: source.id,
                title: source.title,
                count: source._count.posts
            }))
        };
    } catch (error) {
        console.error('Error fetching filters:', error);
        throw createError({ 
            statusCode: 500, 
            statusMessage: "Failed to fetch filter options" 
        });
    }
})
