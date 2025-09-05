interface TempQuoteData {
  content: string
  author: string
  source: string
  additionalInfo: string
  private: boolean
  timestamp: number
}

interface TempPost {
  id: string
  content: string
  author: {
    id: number
    name: string
  }
  source?: {
    title: string
  }
  sourceInfo?: string
  private: boolean
  timestamp: number
  isTemporary: true
}

export const useTempQuote = () => {
  const DRAFT_STORAGE_KEY = 'temp_quote_draft'
  const POSTS_STORAGE_KEY = 'temp_quotes'
  const { authState } = useAuth()

  // Reactive trigger for localStorage changes
  const tempPostsVersion = ref(0)
  const forceUpdate = () => {
    tempPostsVersion.value++
  }

  /**
   * Save quote draft to localStorage when user is not authenticated
   */
  const saveTempQuote = (quoteData: Omit<TempQuoteData, 'timestamp'>) => {
    if (process.client && !authState.value.isLoggedIn) {
      const tempQuote: TempQuoteData = {
        ...quoteData,
        timestamp: Date.now()
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(tempQuote))
    }
  }

  /**
   * Save a complete quote as a temporary post
   */
  const saveTempPost = (quoteData: Omit<TempQuoteData, 'timestamp'>) => {
    if (!process.client) return null

    const tempPost: TempPost = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: quoteData.content,
      author: {
        id: 0,
        name: quoteData.author
      },
      source: quoteData.source ? {
        title: quoteData.source
      } : undefined,
      sourceInfo: quoteData.additionalInfo || undefined,
      private: quoteData.private,
      timestamp: Date.now(),
      isTemporary: true
    }

    // Get existing temp posts
    const existingPosts = getTempPosts()
    const updatedPosts = [tempPost, ...existingPosts]
    
    // Keep only the last 10 temp posts to prevent localStorage bloat
    const limitedPosts = updatedPosts.slice(0, 10)
    
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(limitedPosts))
    
    // Trigger reactivity update
    forceUpdate()
    
    return tempPost
  }

  /**
   * Retrieve temporary quote draft from localStorage
   */
  const getTempQuote = (): TempQuoteData | null => {
    if (!process.client) return null
    
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!stored) return null
      
      const tempQuote = JSON.parse(stored) as TempQuoteData
      
      // Check if temp quote is older than 24 hours (86400000 ms)
      const isExpired = Date.now() - tempQuote.timestamp > 86400000
      if (isExpired) {
        clearTempQuote()
        return null
      }
      
      return tempQuote
    } catch (error) {
      console.warn('Failed to parse temporary quote:', error)
      clearTempQuote()
      return null
    }
  }

  /**
   * Get all temporary posts from localStorage
   */
  const getTempPosts = (): TempPost[] => {
    if (!process.client) return []
    
    try {
      const stored = localStorage.getItem(POSTS_STORAGE_KEY)
      if (!stored) return []
      
      const tempPosts = JSON.parse(stored) as TempPost[]
      
      // Filter out expired posts (older than 7 days)
      const validPosts = tempPosts.filter(post => {
        const isExpired = Date.now() - post.timestamp > 604800000 // 7 days
        return !isExpired
      })
      
      // Update localStorage with filtered posts if some were removed
      if (validPosts.length !== tempPosts.length) {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(validPosts))
      }
      
      return validPosts
    } catch (error) {
      console.warn('Failed to parse temporary posts:', error)
      clearTempPosts()
      return []
    }
  }

  /**
   * Clear temporary quote draft from localStorage
   */
  const clearTempQuote = () => {
    if (process.client) {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
  }

  /**
   * Clear all temporary posts from localStorage
   */
  const clearTempPosts = () => {
    if (process.client) {
      localStorage.removeItem(POSTS_STORAGE_KEY)
      // Trigger reactivity update
      forceUpdate()
    }
  }

  /**
   * Remove a specific temporary post
   */
  const removeTempPost = (postId: string) => {
    if (!process.client) return
    
    const tempPosts = getTempPosts()
    const filteredPosts = tempPosts.filter(post => post.id !== postId)
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts))
    
    // Trigger reactivity update
    forceUpdate()
  }

  /**
   * Check if there's a valid temporary quote
   */
  const hasTempQuote = computed(() => {
    return !!getTempQuote()
  })

  /**
   * Get temporary quote as reactive ref
   */
  const tempQuote = computed(() => {
    return getTempQuote()
  })

  /**
   * Check if current form data has meaningful content (not just empty strings)
   */
  const hasContent = (formData: Omit<TempQuoteData, 'timestamp'>) => {
    return !!(formData.content.trim() || formData.author.trim() || formData.source.trim() || formData.additionalInfo.trim())
  }

  /**
   * Get reactive temporary posts
   */
  const tempPosts = computed(() => {
    // Access the version to make it reactive
    tempPostsVersion.value
    return getTempPosts()
  })

  /**
   * Check if there are any temporary posts
   */
  const hasTempPosts = computed(() => {
    // Access the version to make it reactive
    tempPostsVersion.value
    return getTempPosts().length > 0
  })

  return {
    // Draft functionality
    saveTempQuote,
    getTempQuote,
    clearTempQuote,
    hasTempQuote,
    tempQuote,
    hasContent,
    // Posts functionality
    saveTempPost,
    getTempPosts,
    clearTempPosts,
    removeTempPost,
    tempPosts,
    hasTempPosts
  }
}
