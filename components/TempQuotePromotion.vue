<template>
  <div v-if="showPromotionModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 rounded-t-2xl">
        <div class="flex items-center gap-3 text-white">
          <div class="bg-white/20 p-2 w-10 h-10 rounded-full">
            <Icon name="heroicons:arrow-up-circle" class="size-6" />
          </div>
          <div>
            <h2 class="text-xl font-bold">Save Your Local Quotes</h2>
            <p class="text-amber-100 text-sm">You have {{ tempQuotes.length }} quote{{ tempQuotes.length === 1 ? '' : 's' }} saved locally. Save them to your account?</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Quote Previews -->
        <div class="space-y-4 mb-6 max-h-60 overflow-y-auto">
          <div v-for="quote in tempQuotes" :key="quote.id" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate mb-1">"{{ quote.content }}"</p>
                <p class="text-xs text-gray-600">— {{ quote.author.name }}</p>
                <p v-if="quote.source?.title" class="text-xs text-gray-500">{{ quote.source.title }}</p>
              </div>
              <button 
                @click="toggleQuoteSelection(quote.id)"
                class="flex-shrink-0 p-2 rounded-full transition-colors w-9 h-9"
                :class="selectedQuotes.includes(quote.id) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
              >
                <Icon :name="selectedQuotes.includes(quote.id) ? 'heroicons:check-circle' : 'heroicons:circle'" class="size-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Selection Controls -->
        <div class="flex items-center justify-between mb-6 py-3 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            {{ selectedQuotes.length }} of {{ tempQuotes.length }} selected
          </div>
          <div class="flex gap-2">
            <button 
              @click="selectAll"
              class="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Select All
            </button>
            <span class="text-gray-300">•</span>
            <button 
              @click="selectNone"
              class="text-sm text-gray-500 hover:text-gray-600 font-medium"
            >
              Select None
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 justify-end">
          <button
            @click="dismissModal"
            class="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Maybe Later
          </button>
          <button
            @click="promoteSelectedQuotes"
            :disabled="selectedQuotes.length === 0 || isPromoting"
            class="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Icon v-if="isPromoting" name="line-md:loading-loop" class="size-4" />
            <Icon v-else name="heroicons:arrow-up-circle" class="size-4" />
            {{ isPromoting ? 'Saving...' : `Save ${selectedQuotes.length} Quote${selectedQuotes.length === 1 ? '' : 's'}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const emit = defineEmits<{
  promoted: []
  dismissed: []
}>()

const { authState } = useAuth()
const { tempPosts, removeTempPost, clearTempPosts } = useTempQuote()

const showPromotionModal = ref(false)
const tempQuotes = ref<TempPost[]>([])
const selectedQuotes = ref<string[]>([])
const isPromoting = ref(false)

// Watch for auth state changes to show modal
watch(() => authState.value.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn && tempPosts.value.length > 0) {
    tempQuotes.value = [...tempPosts.value]
    selectedQuotes.value = tempPosts.value.map(q => q.id) // Select all by default
    showPromotionModal.value = true
  }
})

const toggleQuoteSelection = (quoteId: string) => {
  const index = selectedQuotes.value.indexOf(quoteId)
  if (index > -1) {
    selectedQuotes.value.splice(index, 1)
  } else {
    selectedQuotes.value.push(quoteId)
  }
}

const selectAll = () => {
  selectedQuotes.value = tempQuotes.value.map(q => q.id)
}

const selectNone = () => {
  selectedQuotes.value = []
}

const dismissModal = () => {
  showPromotionModal.value = false
  emit('dismissed')
}

const promoteSelectedQuotes = async () => {
  if (selectedQuotes.value.length === 0) return
  
  try {
    isPromoting.value = true
    
    // Get selected quotes
    const quotesToPromote = tempQuotes.value.filter(q => selectedQuotes.value.includes(q.id))
    
    // Save each selected quote to the server
    const promises = quotesToPromote.map(quote => 
      $fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.value.token}`
        },
        body: {
          content: quote.content,
          author: quote.author.name,
          source: quote.source?.title || '',
          additionalInfo: quote.sourceInfo || '',
          private: quote.private
        }
      })
    )
    
    await Promise.all(promises)
    
    // Remove promoted quotes from localStorage
    quotesToPromote.forEach(quote => {
      removeTempPost(quote.id)
    })
    
    // Update the temp quotes list
    tempQuotes.value = tempQuotes.value.filter(q => !selectedQuotes.value.includes(q.id))
    
    // Close modal if no quotes left
    if (tempQuotes.value.length === 0) {
      showPromotionModal.value = false
    }
    
    // Reset selection
    selectedQuotes.value = []
    
    emit('promoted')
    
  } catch (error) {
    console.error('Failed to promote quotes:', error)
    // TODO: Show error message to user
  } finally {
    isPromoting.value = false
  }
}

// Expose method to manually show modal
const showModal = () => {
  if (tempPosts.value.length > 0) {
    tempQuotes.value = [...tempPosts.value]
    selectedQuotes.value = tempPosts.value.map(q => q.id)
    showPromotionModal.value = true
  }
}

defineExpose({
  showModal
})
</script>
