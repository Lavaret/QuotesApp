import db from '../database'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  try {
    if (method === 'GET') {
      // Get user's favorites
      const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
      
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
      
      const favorites = await db.userFavorite.findMany({
        where: {
          userId: decoded.userId
        },
        include: {
          post: {
            include: {
              author: true,
              source: true,
              creator: true
            }
          }
        }
      })

      return favorites.map(fav => fav.post)
    }

    if (method === 'POST') {
      // Add to favorites
      const body = await readBody(event)
      const { postId } = body

      if (!postId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Post ID is required'
        })
      }

      const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
      
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

      // Check if already favorited
      const existingFavorite = await db.userFavorite.findUnique({
        where: {
          userId_postId: {
            userId: decoded.userId,
            postId: parseInt(postId)
          }
        }
      })

      if (existingFavorite) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Post already favorited'
        })
      }

      const favorite = await db.userFavorite.create({
        data: {
          userId: decoded.userId,
          postId: parseInt(postId)
        },
        include: {
          post: {
            include: {
              author: true,
              source: true,
              creator: true
            }
          }
        }
      })

      return { success: true, favorite }
    }

    if (method === 'DELETE') {
      // Remove from favorites
      const query = getQuery(event)
      const postId = query.postId as string

      if (!postId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Post ID is required'
        })
      }

      const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
      
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

      const deleted = await db.userFavorite.deleteMany({
        where: {
          userId: decoded.userId,
          postId: parseInt(postId)
        }
      })

      if (deleted.count === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Favorite not found'
        })
      }

      return { success: true, message: 'Favorite removed' }
    }

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    throw error
  }
})
