import jwt from 'jsonwebtoken'

export interface AuthResult {
  isAuthenticated: boolean
  userId: number | null
  error?: string
}

/**
 * Verifies JWT token and returns authentication status
 * @param event - The event object containing headers
 * @returns AuthResult with authentication status and user ID
 */
export function verifyAuth(event: any): AuthResult {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  
  if (!token) {
    return {
      isAuthenticated: false,
      userId: null,
      error: 'No authorization token provided'
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return {
      isAuthenticated: true,
      userId: decoded.userId,
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      userId: null,
      error: 'Invalid or expired token'
    }
  }
}

/**
 * Verifies authentication and throws error if not authenticated
 * @param event - The event object containing headers
 * @returns The user ID if authenticated
 * @throws createError if authentication fails
 */
export function requireAuth(event: any): number {
  const authResult = verifyAuth(event)
  
  if (!authResult.isAuthenticated || !authResult.userId) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: authResult.error || 'Authentication required' 
    })
  }
  
  return authResult.userId
}
