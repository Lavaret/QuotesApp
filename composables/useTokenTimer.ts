import { ref, readonly, onUnmounted } from 'vue'

interface DecodedToken {
  userId: number
  email: string
  exp: number
  iat: number
}

export const useTokenTimer = () => {
  const { logout } = useAuth()
  
  const timeRemaining = ref<number>(0)
  const isExpired = ref<boolean>(false)
  const isActive = ref<boolean>(false)
  
  let intervalId: NodeJS.Timeout | null = null

  const decodeJWTPayload = (token: string): DecodedToken | null => {
    try {
      // JWT structure: header.payload.signature
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      // Decode the payload (base64url)
      const payload = parts[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded) as DecodedToken
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }

  const startTimer = (token: string) => {
    if (!process.client) return
    
    const decoded = decodeJWTPayload(token)
    if (!decoded || !decoded.exp) return

    const expirationTime = decoded.exp * 1000 // Convert to milliseconds
    
    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, expirationTime - now)
      
      timeRemaining.value = remaining
      isExpired.value = remaining === 0
      
      if (remaining === 0) {
        stopTimer()
        // Auto logout when token expires
        logout()
        // Show notification or redirect
        if (process.client) {
          alert('Your session has expired. Please log in again.')
          window.location.reload()
        }
      }
    }

    // Update immediately
    updateTimer()
    
    // Only start interval if token hasn't expired yet
    if (!isExpired.value) {
      isActive.value = true
      intervalId = setInterval(updateTimer, 1000) // Update every second
    }
  }

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isActive.value = false
    timeRemaining.value = 0
  }

  const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return '0:00'
    
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    
    if (minutes <= 5) return 'text-red-500' // Red when <= 5 minutes
    if (minutes <= 15) return 'text-orange-500' // Orange when <= 15 minutes
    return 'text-green-500' // Green otherwise
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopTimer()
  })

  return {
    timeRemaining: readonly(timeRemaining),
    isExpired: readonly(isExpired),
    isActive: readonly(isActive),
    startTimer,
    stopTimer,
    formatTime,
    getTimeColor
  }
}
