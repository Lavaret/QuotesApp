import prisma from "../database"

export default defineEventHandler(async (event: any) => {
    interface Post {
        id: number,
        sourceInfo?: string,
        sourceId: number,
        author: string,
        content?: string,
        published: boolean,
        creatorId: number,
    }

    if (event.method === 'POST') {
        const body = await readBody(event);

        if (!body.author || !body.content) {
            throw createError({ statusCode: 400, statusMessage: "Invalid data" });
        }

        const post: Post = {
                author: body.author,
                content: body.content,
            }

        return prisma.post.create({
            data: {
                ...post
            },
        });
    }


    return await prisma.post.findMany()
})
