import prisma from "../database"

export default defineEventHandler(async () => {
    return await prisma.user.findMany()
})
