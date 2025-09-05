export default defineNuxtPlugin(() => {
  // Only run on client side to avoid hydration mismatch
  if (process.client) {
    const STORAGE_KEY = 'quotes_dark_mode'
    
    // Wait for DOM to be ready to avoid hydration issues
    const initDarkMode = () => {
      try {
        let isDarkMode = false
        
        // Check if there's a saved preference
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved !== null) {
          isDarkMode = JSON.parse(saved)
        } else {
          // Check system preference if no saved preference
          isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        
        // Apply the dark class and suppress hydration warnings
        if (isDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        
        // Mark body to suppress hydration warnings
        document.body.setAttribute('data-theme-applied', 'true')
        
        console.log('Dark mode plugin initialized:', isDarkMode)
      } catch (error) {
        console.error('Error in dark mode plugin:', error)
      }
    }
    
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDarkMode)
    } else {
      initDarkMode()
    }
  }
})
