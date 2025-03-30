import prisma from "../database"

export default defineEventHandler(async (event: any) => {

    if (event.method === 'POST') {
        const body = await readBody(event);

        if (!body.author || !body.content) {
            throw createError({ statusCode: 400, statusMessage: "Invalid data" });
        }

        return await prisma.post.create({
            data: {
                author: body.author,
                content: body.content,
            },
        });
    }


    return await prisma.post.findMany()
})
