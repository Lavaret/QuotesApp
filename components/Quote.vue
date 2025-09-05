<template>
  <!-- Edit Form Mode -->
  <QuoteForm 
    v-if="isEditing" 
    :post="post" 
    @cancel="handleEditCancel"
    @success="handleEditSuccess"
  />
  
  <!-- Display Mode -->
  <div v-else class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-pink-100 dark:border-gray-700 rounded-md p-6 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
    <!-- Decorative gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white/50 to-rose-50/50 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content wrapper -->
    <div class="relative z-10">
        <!-- Action Icons (all aligned to the right) -->
        <div class="flex justify-end items-center mb-4">
          <div class="flex items-center gap-1">
            <!-- Temporary Quote Indicator with expanding animation -->
            <div v-if="post?.isTemporary" class="group mr-1 overflow-hidden">
              <button 
                @click="$emit('promote-temp-quotes')"
                class="flex items-center h-8 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full transition-all duration-300 cursor-pointer w-8 group-hover:w-32 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600"
                title="Click to save all local quotes permanently"
              >
                <div class="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <Icon name="heroicons:device-phone-mobile" class="size-4 text-amber-500 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-all duration-300 group-hover:scale-110" />
                </div>
                <span class="text-xs font-medium text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 whitespace-nowrap pr-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Saved Locally
                </span>
              </button>
            </div>
            
            <!-- Private Indicator with expanding animation -->
            <div v-if="post?.private" class="group mr-1 overflow-hidden">
              <div class="flex items-center h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 cursor-default w-8 group-hover:w-20">
                <div class="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <Icon name="ph:lock" class="size-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:scale-110" />
                </div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 whitespace-nowrap pr-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Private
                </span>
              </div>
            </div>
            
            <!-- Static Action Buttons -->
            <button 
              v-if="showRemove" 
              @click="$emit('remove')"
              :disabled="isDeleting || isTogglingFavorite"
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/remove flex items-center justify-center',
                isDeleting || isTogglingFavorite ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed opacity-50' : 'hover:bg-red-100 dark:hover:bg-red-900/50'
              ]"
              title="Remove temporary quote"
            >
              <Icon name="heroicons:x-mark" :class="[
                'size-4 transition-all duration-300',
                isDeleting || isTogglingFavorite ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500 group-hover/remove:text-red-500 dark:group-hover/remove:text-red-400 group-hover/remove:scale-110'
              ]" />
            </button>
            <button 
              v-if="canEdit" 
              @click="handleDelete" 
              :disabled="isDeleting || isTogglingFavorite"
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/delete flex items-center justify-center',
                isDeleting || isTogglingFavorite ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed opacity-50' : 'hover:bg-red-100 dark:hover:bg-red-900/50'
              ]"
              :title="isDeleting ? 'Deleting...' : 'Delete quote'"
            >
              <Icon 
                v-if="isDeleting"
                name="line-md:loading-loop" 
                class="size-4 text-red-500" 
              />
              <Icon 
                v-else
                name="ph:trash" 
                :class="[
                  'size-4 transition-all duration-300',
                  isTogglingFavorite ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500 group-hover/delete:text-red-500 dark:group-hover/delete:text-red-400 group-hover/delete:scale-110'
                ]" 
              />
            </button>
            <button 
              v-if="canEdit" 
              @click="startEdit" 
              :disabled="isDeleting || isTogglingFavorite"
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/edit flex items-center justify-center',
                isDeleting || isTogglingFavorite ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed opacity-50' : 'hover:bg-pink-100 dark:hover:bg-pink-900/50'
              ]"
              title="Edit quote"
            >
              <Icon name="ph:pencil" :class="[
                'size-4 transition-all duration-300',
                isDeleting || isTogglingFavorite ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500 group-hover/edit:text-pink-500 dark:group-hover/edit:text-pink-400 group-hover/edit:scale-110'
              ]" />
            </button>
            <button 
              :disabled="isDeleting || isTogglingFavorite"
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/share flex items-center justify-center',
                isDeleting || isTogglingFavorite ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed opacity-50' : 'hover:bg-pink-100 dark:hover:bg-pink-900/50'
              ]"
              title="Share quote"
            >
              <Icon name="ph:share-bold" :class="[
                'size-4 transition-all duration-300',
                isDeleting || isTogglingFavorite ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500 group-hover/share:text-pink-500 dark:group-hover/share:text-pink-400 group-hover/share:scale-110'
              ]" />
            </button>
            <button 
              @click="handleHeartClick" 
              :disabled="isDeleting || isTogglingFavorite"
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/heart flex items-center justify-center',
                isDeleting || isTogglingFavorite ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-not-allowed opacity-50' : 'hover:bg-pink-100 dark:hover:bg-pink-900/50'
              ]" 
              :title="isTogglingFavorite ? (isFavoritedPost ? 'Removing from favorites...' : 'Adding to favorites...') : (isFavoritedPost ? 'Remove from favorites' : 'Add to favorites')"
            >
              <Icon 
                v-if="isTogglingFavorite"
                name="line-md:loading-loop" 
                class="size-4 text-pink-500" 
              />
              <Icon 
                v-else
                :name="isFavoritedPost ? 'ph:heart-fill' : 'ph:heart-bold'" 
                :class="[
                  'size-4 transition-all duration-300',
                  isDeleting ? 'text-gray-300 dark:text-gray-600' : (
                    isFavoritedPost ? 'text-pink-500 dark:text-pink-400 group-hover/heart:text-pink-600 dark:group-hover/heart:text-pink-300 group-hover/heart:scale-110' : 'text-pink-400 dark:text-pink-500 group-hover/heart:text-pink-600 dark:group-hover/heart:text-pink-300 group-hover/heart:scale-110'
                  )
                ]" 
              />
            </button>
          </div>
        </div>

        <!-- Quote Content -->
        <div class="mb-6">
          <div class="flex items-start gap-3">
            <Icon name="icon-park-outline:quote" class="size-8 text-pink-300 dark:text-pink-500 mt-[-1rem] flex-shrink-0 transition-colors duration-200" />
            <div class="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium transition-colors duration-200">
              <slot name="content" />
            </div>
          </div>
        </div>

        <!-- Author -->
        <div class="flex justify-end items-center gap-3 mb-2" v-if="$slots.author">
          <div class="h-px bg-gradient-to-r from-transparent to-pink-200 dark:to-pink-600 flex-1 transition-colors duration-200"></div>
          <div class="text-gray-700 dark:text-gray-300 font-semibold text-lg transition-colors duration-200">
            <slot name="author" />
          </div>
        </div>

        <!-- Source -->
        <div class="text-right" v-if="$slots.source">
          <div class="text-pink-600 dark:text-pink-400 text-sm font-medium transition-colors duration-200">
            <slot name="source" />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  post?: {
    id: number | string
    author: {
      id: number
      name: string
    }
    content?: string
    source?: {
      title: string
    }
    sourceInfo?: string
    private?: boolean
    creator?: {
      id: number
      name: string
      email: string
    }
    isTemporary?: boolean
  }
  showRemove?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['updated', 'remove', 'promote-temp-quotes'])

const { authState } = useAuth()
const { isFavorited, toggleFavorite } = useFavorites()

const isEditing = ref(false)
const isTogglingFavorite = ref(false)
const isDeleting = ref(false)

const canEdit = computed(() => {
  return authState.value.isLoggedIn && 
         props.post && 
         props.post.creator && 
         authState.value.user?.id === props.post.creator.id
})

// Check if current post is favorited
const isFavoritedPost = computed(() => {
  return props.post ? isFavorited(props.post.id) : false
})

const startEdit = () => {
  isEditing.value = true
}

const handleEditCancel = () => {
  isEditing.value = false
}

const handleEditSuccess = () => {
  // Emit update event to refresh parent component
  emit('updated')
}

const handleDelete = async () => {
  if (!props.post || !confirm('Are you sure you want to delete this quote? It will be archived and can be restored later.')) {
    return
  }
  
  isDeleting.value = true
  try {
    const response = await $fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authState.value.token}`
      },
      body: {
        id: props.post.id
      }
    })
    
    if (response.success) {
      // Emit update event to refresh parent component
      emit('updated')
    }
  } catch (error) {
    console.error('Failed to delete quote:', error)
    alert('Failed to delete quote. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

const handleHeartClick = async () => {
  if (!props.post) return
  
  isTogglingFavorite.value = true
  try {
    await toggleFavorite(props.post.id)
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    // You could add a toast notification here
  } finally {
    isTogglingFavorite.value = false
  }
}
</script>

<style>
.icon {
  @apply transition delay-150 duration-300 ease-in-out hover:scale-125
}
</style>
