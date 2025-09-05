interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
}

export const useAuth = () => {
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    token: null,
    isLoggedIn: false
  }))
  
  // Initialize tokenTimer separately so it can be used in login/logout functions
  let tokenTimerInstance: ReturnType<typeof useTokenTimer> | null = null

  const login = (token: string, user: User) => {
    authState.value.token = token
    authState.value.user = user
    authState.value.isLoggedIn = true
    
    // Store token in localStorage for persistence
    if (process.client) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Start token expiration timer when logging in
      if (!tokenTimerInstance) {
        tokenTimerInstance = useTokenTimer()
      }
      tokenTimerInstance.startTimer(token)
    }
  }

  const logout = () => {
    authState.value.token = null
    authState.value.user = null
    authState.value.isLoggedIn = false
    
    // Stop token timer
    if (tokenTimerInstance) {
      tokenTimerInstance.stopTimer()
    }
    
    // Remove from localStorage
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  const initAuth = () => {
    // Initialize auth state from localStorage on client side
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          authState.value.token = token
          authState.value.user = user
          authState.value.isLoggedIn = true
          
          // Initialize token timer
          if (!tokenTimerInstance) {
            tokenTimerInstance = useTokenTimer()
          }
          tokenTimerInstance.startTimer(token)
        } catch (error) {
          // Invalid stored data, clear it
          logout()
        }
      }
    }
  }

  // Get the current token timer instance
  const getTokenTimer = () => {
    if (!tokenTimerInstance && process.client) {
      tokenTimerInstance = useTokenTimer()
      
      // If already logged in, start the timer
      if (authState.value.isLoggedIn && authState.value.token) {
        tokenTimerInstance.startTimer(authState.value.token)
      }
    }
    return tokenTimerInstance
  }

  return {
    authState: readonly(authState),
    login,
    logout,
    initAuth,
    getTokenTimer
  }
}
