<template>
  <div class="min-h-full py-8 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-4xl mx-auto">

      <!-- Page Header -->
      <div class="mb-8">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Your Quotes Space
          </h1>
          <p class="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-200">Discover, save, and share wisdom from around the world</p>
        </div>
      </div>

      <!-- Filter Toggle Button -->
      <div class="mb-4 flex justify-start" ref="filterToggle">
        <button
            v-if="!showFilters"
            @click="showFilters = !showFilters"
            :class="[
            'flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-md shadow-sm hover:shadow-md transition-all duration-200',
            hasAnyActiveFilters 
              ? 'bg-pink-100/80 dark:bg-pink-900/30 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300 hover:text-pink-800 dark:hover:text-pink-200' 
              : 'bg-white/60 dark:bg-gray-800/60 border-pink-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          ]"
        >
          <Icon name="ph:funnel" class="size-4" />
          <span class="text-sm font-medium">{{ showFilters ? 'Hide' : 'Show' }} Filters</span>
          <span v-if="hasAnyActiveFilters" class="text-xs bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-2 py-0.5 rounded-full transition-colors duration-200">
            Active
          </span>
          <Icon :name="showFilters ? 'ph:chevron-up' : 'ph:chevron-down'" class="size-4 transition-transform duration-200" />
        </button>
      </div>

      <!-- Collapsible Filter Section -->
      <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0 transform -translate-y-4"
          enter-to-class="opacity-100 max-h-96 transform translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-96 transform translate-y-0"
          leave-to-class="opacity-0 max-h-0 transform -translate-y-4"
      >
        <div v-if="showFilters" class="mb-6 overflow-hidden" ref="filtersContainer">
          <!-- Unified Search & Filters Container -->
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-pink-100 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-colors duration-200">
            <!-- Header with Search and Close Button -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <Icon name="ph:funnel" class="size-5 text-gray-600 dark:text-gray-300" />
                <h3 class="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">Search & Filters</h3>
              </div>
              
              <button 
                id="closeFilters"
                @click="showFilters = false"
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                title="Close filters"
              >
                <Icon name="ph:x" class="size-5"/>
              </button>
            </div>
            
            <!-- Search Bar -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 transition-colors duration-200">
                <Icon name="ph:magnifying-glass" class="size-4 text-gray-500 dark:text-gray-400" />
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="ph:magnifying-glass" class="size-5 text-gray-400 dark:text-gray-500 z-[99]" />
                </div>
                <input
                    v-model="searchQuery"
                    type="text"
                    class="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 focus:border-pink-300 dark:focus:border-pink-600 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    placeholder="Search quotes, authors, or sources..."
                />
                <button
                    v-if="searchQuery.trim()"
                    @click="searchQuery = ''"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon name="ph:x" class="size-5" />
                </button>
              </div>
            </div>
            
            <!-- Filter Options Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <!-- Authors Filter -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-200">
                    <Icon name="ph:user" class="size-4 text-blue-500 dark:text-blue-400" />
                    Authors
                  </label>
                  <span v-if="selectedAuthors.length > 0" class="text-xs text-blue-600 dark:text-blue-400 font-medium transition-colors duration-200">
                    {{ selectedAuthors.length }} selected
                  </span>
                </div>
                <div class="max-h-32 overflow-y-auto space-y-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                  <label 
                    v-for="author in availableAuthors" 
                    :key="author.id"
                    class="flex items-center gap-2 p-2 rounded-md hover:bg-white/80 dark:hover:bg-gray-600/50 cursor-pointer transition-colors group"
                  >
                    <input 
                      type="checkbox"
                      :value="author.id"
                      v-model="selectedAuthors"
                      class="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 bg-white dark:bg-gray-700"
                    />
                    <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">{{ author.name }}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">({{ author.count }})</span>
                  </label>
                  <div v-if="availableAuthors.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-2 transition-colors duration-200">
                    No authors available
                  </div>
                </div>
              </div>
              
              <!-- Sources Filter -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-200">
                    <Icon name="ph:book" class="size-4 text-green-500 dark:text-green-400" />
                    Sources
                  </label>
                  <span v-if="selectedSources.length > 0" class="text-xs text-green-600 dark:text-green-400 font-medium transition-colors duration-200">
                    {{ selectedSources.length }} selected
                  </span>
                </div>
                <div class="max-h-32 overflow-y-auto space-y-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                  <label 
                    v-for="source in availableSources" 
                    :key="source.id"
                    class="flex items-center gap-2 p-2 rounded-md hover:bg-white/80 dark:hover:bg-gray-600/50 cursor-pointer transition-colors group"
                  >
                    <input 
                      type="checkbox"
                      :value="source.id"
                      v-model="selectedSources"
                      class="rounded border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-500 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-2 bg-white dark:bg-gray-700"
                    />
                    <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">{{ source.title }}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">({{ source.count }})</span>
                  </label>
                  <div v-if="availableSources.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-2 transition-colors duration-200">
                    No sources available
                  </div>
                </div>
              </div>
              
              <!-- Special Filters -->
              <div class="space-y-3">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors duration-200">
                  <Icon name="ph:heart" class="size-4 text-pink-500 dark:text-pink-400" />
                  Special Filters
                </label>
                <div class="space-y-2">
                  <button 
                    @click="showFavoritesOnly = !showFavoritesOnly"
                    :class="[
                      'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm',
                      showFavoritesOnly 
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-600'
                    ]"
                    title="Filter by favorites"
                  >
                    <Icon 
                      :name="showFavoritesOnly ? 'ph:heart-fill' : 'ph:heart'" 
                      :class="[
                        'size-4 transition-all duration-200',
                        showFavoritesOnly ? 'text-white' : 'text-pink-400 dark:text-pink-500'
                      ]" 
                    />
                    <span>Favorites Only</span>
                    <span v-if="showFavoritesOnly && favoritesCount > 0" class="bg-white/20 dark:bg-white/30 px-2 py-0.5 rounded-full text-xs">
                      {{ favoritesCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Results Summary and Clear Button -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors duration-200">
              <div v-if="hasAnyActiveFilters" class="flex flex-wrap items-center gap-2 text-sm">
                <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                  <Icon name="ph:info" class="size-4" />
                  <span>Found {{ filteredPosts.length + filteredTempPosts.length }} quote{{ filteredPosts.length + filteredTempPosts.length === 1 ? '' : 's' }}</span>
                  <span v-if="filteredTempPosts.length > 0" class="text-amber-600 dark:text-amber-400 transition-colors duration-200">
                    ({{ filteredTempPosts.length }} local)
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-2">
                  <span v-if="searchQuery.trim()" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs transition-colors duration-200">
                    <Icon name="ph:magnifying-glass" class="size-3" />
                    Search active
                  </span>
                  
                  <span v-if="showFavoritesOnly" class="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs transition-colors duration-200">
                    <Icon name="ph:heart-fill" class="size-3" />
                    Favorites
                  </span>
                  
                  <span v-if="selectedAuthors.length > 0" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs transition-colors duration-200">
                    <Icon name="ph:user" class="size-3" />
                    {{ selectedAuthors.length }} author{{ selectedAuthors.length > 1 ? 's' : '' }}
                  </span>
                  
                  <span v-if="selectedSources.length > 0" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs transition-colors duration-200">
                    <Icon name="ph:book" class="size-3" />
                    {{ selectedSources.length }} source{{ selectedSources.length > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
              
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Use search and filters to find specific quotes
              </div>
              
              <button 
                v-if="hasAnyActiveFilters"
                @click="clearAllFilters"
                class="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 text-sm font-medium"
                title="Clear all filters"
              >
                <Icon name="ph:x" class="size-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Add Quote Button -->
      <div v-if="!addNewQuote" class="mb-6 flex justify-center">
        <button 
          @click="addNewQuote = true" 
          class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
        >
          <Icon name="ph:plus-circle" class="size-5" />
          Add New Quote
        </button>
      </div>

      <!-- Quotes Container -->
      <div class="space-y-6" ref="container">
        <QuoteForm 
          v-if="addNewQuote" 
          @cancel="handleNewQuoteCancel"
          @success="handleNewQuoteSuccess"
        />
        
        <!-- Display temporary quotes (localStorage) -->
        <Quote 
          v-for="tempPost in filteredTempPosts"
          :key="tempPost.id" 
          :post="tempPost"
          :show-remove="true"
          class="border-l-4 border-amber-400"
          @remove="removeTempPost(tempPost.id)"
          @promote-temp-quotes="showPromotionModal"
        >
          <template #author v-if="tempPost.author?.name">
            {{ tempPost.author.name }}
          </template>
          <template #content v-if="tempPost.content">
            {{ tempPost.content }}
          </template>
          <template #source v-if="tempPost.source?.title || tempPost.sourceInfo">
            <div class="flex flex-col gap-1">
              <span v-if="tempPost.source?.title">{{ tempPost.source.title }}</span>
              <span v-if="tempPost.sourceInfo" class="text-xs text-stone-500">{{ tempPost.sourceInfo }}</span>
            </div>
          </template>
        </Quote>
        
        <!-- Display actual posts from database -->
        <Quote 
          v-for="post in filteredPosts"
          :key="post.id" 
          :post="post"
          @updated="handleQuoteUpdated"
        >
          <template #author v-if="post.author?.name">
            {{ post.author.name }}
          </template>
          <template #content v-if="post.content">
            {{ post.content }}
          </template>
          <template #source v-if="post.source?.title || post.sourceInfo">
            <div class="flex flex-col gap-1">
              <span v-if="post.source?.title">{{ post.source.title }}</span>
              <span v-if="post.sourceInfo" class="text-xs text-stone-500">{{ post.sourceInfo }}</span>
            </div>
          </template>
        </Quote>
        
        <!-- No results found message -->
        <div v-if="searchQuery.trim() && filteredPosts.length === 0 && filteredTempPosts.length === 0" class="text-center py-16">
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 max-w-md mx-auto transition-colors duration-200">
            <div class="bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Icon name="ph:magnifying-glass" class="size-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">No quotes found</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">No quotes match your search for "{{ searchQuery }}"</p>
            <button 
              @click="searchQuery = ''"
              class="bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 hover:from-gray-600 hover:to-gray-800 dark:hover:from-gray-700 dark:hover:to-gray-900 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
        
        <!-- Fallback message if no posts -->
        <div v-else-if="(!posts || posts.length === 0) && tempPosts.length === 0" class="text-center py-16">
          <div class="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-12 max-w-md mx-auto transition-colors duration-200">
            <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Icon name="icon-park-outline:quote" class="size-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-200">No quotes yet</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">Start building your collection of inspiring quotes!</p>
            <button 
              @click="addNewQuote = true" 
              class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Add your first quote
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Temporary Quote Promotion Modal -->
    <TempQuotePromotion 
      ref="promotionModal"
      @promoted="handleQuotesPromoted"
      @dismissed="handlePromotionDismissed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import autoAnimate from "@formkit/auto-animate"

const container = ref() // we need a DOM node
const filterToggle = ref()
const filtersContainer = ref()
const { authState } = useAuth()
const { loadFavorites, syncGuestFavorites, clearFavorites, favorites, isFavorited } = useFavorites()
const { tempPosts, removeTempPost } = useTempQuote()

// Filter state with localStorage persistence
const FILTERS_STORAGE_KEY = 'quotes_filters'

// Load filters from localStorage
const loadFiltersFromStorage = () => {
  if (!process.client) return {}
  
  try {
    const stored = localStorage.getItem(FILTERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error)
    return {}
  }
}

// Save filters to localStorage
const saveFiltersToStorage = (filters: any) => {
  if (!process.client) return
  
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error)
  }
}

const savedFilters = loadFiltersFromStorage()

const showFavoritesOnly = ref(savedFilters.showFavoritesOnly || false)
const selectedAuthors = ref<number[]>(savedFilters.selectedAuthors || [])
const selectedSources = ref<number[]>(savedFilters.selectedSources || [])
const searchQuery = ref('') // Don't persist search query
const showFilters = ref(savedFilters.showFilters || false)

// Fetch filter options
const { data: filterOptions, refresh: refreshFilterOptions } = await useFetch('/api/filters')

// Auto-show filters when there's a search query
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() && !showFilters.value) {
    showFilters.value = true
  }
})

// Computed filtered posts
const filteredPosts = computed(() => {
  if (!posts.value) return []
  
  let filtered = posts.value
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(post => {
      const content = post.content?.toLowerCase() || ''
      const author = post.author?.name?.toLowerCase() || ''
      const source = post.source?.title?.toLowerCase() || ''
      const sourceInfo = post.sourceInfo?.toLowerCase() || ''
      
      return content.includes(query) || 
             author.includes(query) || 
             source.includes(query) || 
             sourceInfo.includes(query)
    })
  }
  
  // Apply author filter
  if (selectedAuthors.value.length > 0) {
    filtered = filtered.filter(post => 
      selectedAuthors.value.includes(post.author?.id)
    )
  }
  
  // Apply source filter
  if (selectedSources.value.length > 0) {
    filtered = filtered.filter(post => 
      selectedSources.value.includes(post.source?.id)
    )
  }
  
  // Apply favorites filter
  if (showFavoritesOnly.value) {
    filtered = filtered.filter(post => isFavorited(post.id))
  }
  
  return filtered
})

// Computed filtered temporary posts  
const filteredTempPosts = computed(() => {
  if (!tempPosts.value.length) return []
  
  let filtered = tempPosts.value
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(post => {
      const content = post.content?.toLowerCase() || ''
      const author = post.author?.name?.toLowerCase() || ''
      const source = post.source?.title?.toLowerCase() || ''
      const sourceInfo = post.sourceInfo?.toLowerCase() || ''
      
      return content.includes(query) || 
             author.includes(query) || 
             source.includes(query) || 
             sourceInfo.includes(query)
    })
  }
  
  // Apply author filter (match by name for temp posts)
  if (selectedAuthors.value.length > 0 && filterOptions.value?.authors) {
    const selectedAuthorNames = filterOptions.value.authors
      .filter(author => selectedAuthors.value.includes(author.id))
      .map(author => author.name.toLowerCase())
    
    filtered = filtered.filter(post => 
      selectedAuthorNames.includes(post.author?.name?.toLowerCase() || '')
    )
  }
  
  // Apply source filter (match by title for temp posts)
  if (selectedSources.value.length > 0 && filterOptions.value?.sources) {
    const selectedSourceTitles = filterOptions.value.sources
      .filter(source => selectedSources.value.includes(source.id))
      .map(source => source.title.toLowerCase())
    
    filtered = filtered.filter(post => 
      selectedSourceTitles.includes(post.source?.title?.toLowerCase() || '')
    )
  }
  
  // Apply favorites filter (temp posts are never favorited)
  if (showFavoritesOnly.value) {
    filtered = [] // Temp posts can't be favorites
  }
  
  return filtered
})

// Fetch posts (initially without auth headers)
const { data: posts, refresh: refreshPosts } = await useFetch('/api/posts')

// Function to refresh posts with current auth state
const refreshPostsWithAuth = async () => {
  await refreshPosts()
}

// Computed for checking if any filters are active
const hasAnyActiveFilters = computed(() => {
  return searchQuery.value.trim() || 
         showFavoritesOnly.value || 
         selectedAuthors.value.length > 0 || 
         selectedSources.value.length > 0
})

// Computed for available filter options
const availableAuthors = computed(() => filterOptions.value?.authors || [])
const availableSources = computed(() => filterOptions.value?.sources || [])

// Computed favorites count for display
const favoritesCount = computed(() => {
  if (!showFavoritesOnly.value) return 0
  return filteredPosts.value.length + filteredTempPosts.value.length
})

// Clear all filters function
const clearAllFilters = () => {
  showFavoritesOnly.value = false
  selectedAuthors.value = []
  selectedSources.value = []
  searchQuery.value = ''
  
  // Clear from localStorage
  saveFiltersToStorage({
    showFavoritesOnly: false,
    selectedAuthors: [],
    selectedSources: [],
    showFilters: showFilters.value
  })
}

// Watch for auth state changes to refresh posts and filters with proper headers
watch(() => authState.value.isLoggedIn, async (isLoggedIn) => {
  if (isLoggedIn) {
    // User just logged in - sync guest favorites and load user favorites
    await syncGuestFavorites()
    await loadFavorites()
  } else {
    // User logged out - clear user favorites but keep guest favorites
    clearFavorites()
  }
  
  // Refresh posts when auth state changes
  await $fetch('/api/posts', {
    headers: isLoggedIn && authState.value.token 
      ? { 'Authorization': `Bearer ${authState.value.token}` }
      : {}
  }).then(newPosts => {
    posts.value = newPosts
  })
  
  // Refresh filter options when auth state changes
  await refreshFilterOptions()
}, { immediate: false })

const addNewQuote = ref(false)

const handleNewQuoteCancel = () => {
  addNewQuote.value = false
}

const handleNewQuoteSuccess = async () => {
  // Refresh the posts list when a new quote is created with auth headers
  await $fetch('/api/posts', {
    headers: authState.value.isLoggedIn && authState.value.token 
      ? { 'Authorization': `Bearer ${authState.value.token}` }
      : {}
  }).then(newPosts => {
    posts.value = newPosts
  })
  
  // Refresh filter options to include new authors/sources
  await refreshFilterOptions()
  
  // The QuoteForm component will handle closing itself after success
}

const handleQuoteUpdated = async () => {
  // Refresh the posts list when a quote is updated with auth headers
  await $fetch('/api/posts', {
    headers: authState.value.isLoggedIn && authState.value.token 
      ? { 'Authorization': `Bearer ${authState.value.token}` }
      : {}
  }).then(newPosts => {
    posts.value = newPosts
  })
  
  // Refresh filter options to include updated authors/sources
  await refreshFilterOptions()
}

const handleQuotesPromoted = async () => {
  // Refresh posts list after quotes are promoted
  await handleNewQuoteSuccess()
}

const handlePromotionDismissed = () => {
  // Handle when user dismisses the promotion modal
  // Could add analytics or other tracking here
}

// Reference to the promotion modal
const promotionModal = ref()

const showPromotionModal = () => {
  // Only show the promotion modal if user is logged in
  if (authState.value.isLoggedIn && promotionModal.value) {
    promotionModal.value.showModal()
  }
  // For non-logged-in users, the click does nothing (just visual feedback)
}

// Watch filter changes and save to localStorage
watch([showFavoritesOnly, selectedAuthors, selectedSources, showFilters], () => {
  saveFiltersToStorage({
    showFavoritesOnly: showFavoritesOnly.value,
    selectedAuthors: selectedAuthors.value,
    selectedSources: selectedSources.value,
    showFilters: showFilters.value
  })
}, { deep: true })

onMounted(async () => {
  // Initialize autoAnimate with error handling
  try {
    if (container.value) {
      autoAnimate(container.value)
    }
    if (filterToggle.value) {
      autoAnimate(filterToggle.value)
    }
    if (filtersContainer.value) {
      autoAnimate(filtersContainer.value)
    }
  } catch (error) {
    console.warn('AutoAnimate initialization failed:', error)
  }
  
  // Load favorites (will load from localStorage for guests or API for logged-in users)
  await loadFavorites()
  
  // Refresh posts and filter options with auth headers if user is already logged in
  if (authState.value.isLoggedIn && authState.value.token) {
    await $fetch('/api/posts', {
      headers: { 'Authorization': `Bearer ${authState.value.token}` }
    }).then(newPosts => {
      posts.value = newPosts
    })
    
    await refreshFilterOptions()
  }
})
</script>

<style>
.input {
  @apply bg-transparent border border-2 border-stone-300 rounded-md
}

/* Animation for icons */
.icon {
  @apply transition delay-150 duration-300 ease-in-out hover:scale-125
}
</style>
