export const useFavorites = () => {
  const { authState } = useAuth()
  
  // Use global state for favorites that persists across components
  const favorites = useState<number[]>('favorites', () => [])
  const isLoading = useState<boolean>('favorites-loading', () => false)

  // Load favorites on initialization
  const loadFavorites = async () => {
    isLoading.value = true
    try {
      if (authState.value.isLoggedIn) {
        // Load from API for logged-in users
        const userFavorites = await $fetch('/api/favorites', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authState.value.token}`
          }
        })
        favorites.value = (userFavorites as any[])?.map((post: any) => post.id) || []
      } else {
        // Load from localStorage for guests
        if (process.client) {
          const storedFavorites = localStorage.getItem('guest-favorites')
          favorites.value = storedFavorites ? JSON.parse(storedFavorites) : []
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      favorites.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Check if a post is favorited
  const isFavorited = (postId: number) => {
    return favorites.value.includes(postId)
  }

  // Add to favorites
  const addToFavorites = async (postId: number) => {
    try {
      if (authState.value.isLoggedIn) {
        // Add via API for logged-in users
        await $fetch('/api/favorites', {
          method: 'POST',
          body: { postId },
          headers: {
            'Authorization': `Bearer ${authState.value.token}`
          }
        })
        favorites.value.push(postId)
      } else {
        // Add to localStorage for guests
        if (process.client) {
          if (!favorites.value.includes(postId)) {
            favorites.value.push(postId)
            localStorage.setItem('guest-favorites', JSON.stringify(favorites.value))
          }
        }
      }
    } catch (error: any) {
      // If already favorited, just add to local state
      if (error?.statusCode === 409) {
        if (!favorites.value.includes(postId)) {
          favorites.value.push(postId)
        }
      } else {
        console.error('Error adding to favorites:', error)
        throw error
      }
    }
  }

  // Remove from favorites
  const removeFromFavorites = async (postId: number) => {
    try {
      if (authState.value.isLoggedIn) {
        // Remove via API for logged-in users
        await $fetch('/api/favorites', {
          method: 'DELETE',
          query: { postId },
          headers: {
            'Authorization': `Bearer ${authState.value.token}`
          }
        })
        favorites.value = favorites.value.filter(id => id !== postId)
      } else {
        // Remove from localStorage for guests
        if (process.client) {
          favorites.value = favorites.value.filter(id => id !== postId)
          localStorage.setItem('guest-favorites', JSON.stringify(favorites.value))
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  // Toggle favorite status
  const toggleFavorite = async (postId: number) => {
    if (isFavorited(postId)) {
      await removeFromFavorites(postId)
    } else {
      await addToFavorites(postId)
    }
  }

  // Sync guest favorites to user account when logging in
  const syncGuestFavorites = async () => {
    if (process.client && authState.value.isLoggedIn) {
      const guestFavorites = localStorage.getItem('guest-favorites')
      if (guestFavorites) {
        const guestFavoriteIds = JSON.parse(guestFavorites)
        
        // Add each guest favorite to user account
        for (const postId of guestFavoriteIds) {
          try {
            await addToFavorites(postId)
          } catch (error) {
            console.warn(`Failed to sync favorite ${postId}:`, error)
          }
        }
        
        // Clear guest favorites from localStorage
        localStorage.removeItem('guest-favorites')
      }
      
      // Reload user favorites from server
      await loadFavorites()
    }
  }

  // Clear favorites on logout
  const clearFavorites = () => {
    favorites.value = []
    if (process.client) {
      // Keep guest favorites but clear user favorites
      const guestFavorites = localStorage.getItem('guest-favorites')
      if (guestFavorites) {
        favorites.value = JSON.parse(guestFavorites)
      }
    }
  }

  return {
    favorites: readonly(favorites),
    isLoading: readonly(isLoading),
    loadFavorites,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    syncGuestFavorites,
    clearFavorites
  }
}
