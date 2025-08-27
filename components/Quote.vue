<template>
  <!-- Edit Form Mode -->
  <QuoteForm 
    v-if="isEditing" 
    :post="post" 
    @cancel="handleEditCancel"
    @success="handleEditSuccess"
  />
  
  <!-- Display Mode -->
  <div v-else class="bg-white/70 backdrop-blur-sm border border-pink-100 rounded-md p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
    <!-- Decorative gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content wrapper -->
    <div class="relative z-10">
        <!-- Action Icons (all aligned to the right) -->
        <div class="flex justify-end items-center mb-4">
          <div class="flex items-center gap-1">
            <!-- Temporary Quote Indicator with expanding animation -->
            <div v-if="post?.isTemporary" class="group mr-1 overflow-hidden">
              <button 
                @click="$emit('promote-temp-quotes')"
                class="flex items-center h-8 hover:bg-amber-100 rounded-full transition-all duration-300 cursor-pointer w-8 group-hover:w-32 focus:outline-none focus:ring-2 focus:ring-amber-300"
                title="Click to save all local quotes permanently"
              >
                <div class="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <Icon name="heroicons:device-phone-mobile" class="size-4 text-amber-500 group-hover:text-amber-600 transition-all duration-300 group-hover:scale-110" />
                </div>
                <span class="text-xs font-medium text-amber-600 group-hover:text-amber-700 whitespace-nowrap pr-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Saved Locally
                </span>
              </button>
            </div>
            
            <!-- Private Indicator with expanding animation -->
            <div v-if="post?.private" class="group mr-1 overflow-hidden">
              <div class="flex items-center h-8 hover:bg-gray-100 rounded-full transition-all duration-300 cursor-default w-8 group-hover:w-20">
                <div class="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <Icon name="ph:lock" class="size-4 text-gray-400 group-hover:text-gray-800 transition-all duration-300 group-hover:scale-110" />
                </div>
                <span class="text-xs font-medium text-gray-600 group-hover:text-gray-800 whitespace-nowrap pr-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Private
                </span>
              </div>
            </div>
            
            <!-- Static Action Buttons -->
            <button 
              v-if="showRemove" 
              @click="$emit('remove')"
              class="w-8 h-8 rounded-full hover:bg-red-100 transition-all duration-300 group/remove flex items-center justify-center"
              title="Remove temporary quote"
            >
              <Icon name="heroicons:x-mark" class="size-4 text-gray-400 group-hover/remove:text-red-500 transition-all duration-300 group-hover/remove:scale-110" />
            </button>
            <button 
              v-if="canEdit" 
              @click="startEdit" 
              class="w-8 h-8 rounded-full hover:bg-pink-100 transition-all duration-300 group/edit flex items-center justify-center"
              title="Edit quote"
            >
              <Icon name="ph:pencil" class="size-4 text-gray-400 group-hover/edit:text-pink-500 transition-all duration-300 group-hover/edit:scale-110" />
            </button>
            <button class="w-8 h-8 rounded-full hover:bg-pink-100 transition-all duration-300 group/share flex items-center justify-center" title="Share quote">
              <Icon name="ph:share-bold" class="size-4 text-gray-400 group-hover/share:text-pink-500 transition-all duration-300 group-hover/share:scale-110" />
            </button>
            <button 
              @click="handleHeartClick" 
              :class="[
                'w-8 h-8 rounded-full transition-all duration-300 group/heart flex items-center justify-center hover:bg-pink-100',
              ]" 
              :title="isFavoritedPost ? 'Remove from favorites' : 'Add to favorites'"
              :disabled="isTogglingFavorite"
            >
              <Icon 
                :name="isFavoritedPost ? 'ph:heart-fill' : 'ph:heart-bold'" 
                :class="[
                  'size-4 transition-all duration-300 group-hover/heart:scale-110',
                  isFavoritedPost ? 'text-pink-500 group-hover/heart:text-pink-600' : 'text-pink-400 group-hover/heart:text-pink-600'
                ]" 
              />
            </button>
          </div>
        </div>

        <!-- Quote Content -->
        <div class="mb-6">
          <div class="flex items-start gap-3">
            <Icon name="icon-park-outline:quote" class="size-8 text-pink-300 mt-[-1rem] flex-shrink-0" />
            <div class="text-gray-800 text-lg leading-relaxed font-medium">
              <slot name="content" />
            </div>
          </div>
        </div>

        <!-- Author -->
        <div class="flex justify-end items-center gap-3 mb-2" v-if="$slots.author">
          <div class="h-px bg-gradient-to-r from-transparent to-pink-200 flex-1"></div>
          <div class="text-gray-700 font-semibold text-lg">
            <slot name="author" />
          </div>
        </div>

        <!-- Source -->
        <div class="text-right" v-if="$slots.source">
          <div class="text-pink-600 text-sm font-medium">
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
