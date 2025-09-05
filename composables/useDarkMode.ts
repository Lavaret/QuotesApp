export const useDarkMode = () => {
  const STORAGE_KEY = 'quotes_dark_mode'
  
  // Initialize dark mode state
  const isDark = ref(false)
  
  // Load saved preference from localStorage
  const loadDarkMode = () => {
    if (!process.client) return false
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null) {
        return JSON.parse(saved)
      }
      
      // If no preference saved, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (error) {
      console.warn('Failed to load dark mode preference:', error)
      return false
    }
  }
  
  // Save dark mode preference to localStorage
  const saveDarkMode = (isDarkMode: boolean) => {
    if (!process.client) return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isDarkMode))
    } catch (error) {
      console.warn('Failed to save dark mode preference:', error)
    }
  }
  
  // Apply dark mode to document
  const applyDarkMode = (isDarkMode: boolean) => {
    if (!process.client) return
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    applyDarkMode(isDark.value)
    saveDarkMode(isDark.value)
  }
  
  // Set dark mode explicitly
  const setDarkMode = (isDarkMode: boolean) => {
    isDark.value = isDarkMode
    applyDarkMode(isDarkMode)
    saveDarkMode(isDarkMode)
  }
  
  // Initialize on client side
  const initDarkMode = () => {
    if (!process.client) return
    
    try {
      const savedPreference = loadDarkMode()
      isDark.value = savedPreference
      applyDarkMode(savedPreference)
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't set a preference
        const hasStoredPreference = localStorage.getItem(STORAGE_KEY) !== null
        if (!hasStoredPreference) {
          setDarkMode(e.matches)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    } catch (error) {
      console.error('Error initializing dark mode:', error)
    }
  }
  
  // Computed property for theme icon
  const themeIcon = computed(() => {
    return isDark.value ? 'ph:sun' : 'ph:moon'
  })
  
  // Computed property for theme label
  const themeLabel = computed(() => {
    return isDark.value ? 'Light Mode' : 'Dark Mode'
  })
  
  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    setDarkMode,
    initDarkMode,
    themeIcon,
    themeLabel
  }
}
