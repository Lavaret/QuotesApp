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
        <!-- Action Icons -->
        <div class="flex justify-end gap-3 mb-4" v-if="$slots.icons">
          <slot name="icons" />
        </div>
        <div class="flex justify-end gap-3 mb-4" v-else>
          <button 
            v-if="canEdit" 
            @click="startEdit" 
            class="w-9 h-9 rounded-full hover:bg-pink-100 transition-colors duration-200 group/edit flex items-center justify-center"
            title="Edit quote"
          >
            <Icon name="ph:pencil" class="size-5 text-gray-400 group-hover/edit:text-pink-500 transition-colors duration-200" />
          </button>
          <button class="w-9 h-9 rounded-full hover:bg-pink-100 transition-colors duration-200 group/share flex items-center justify-center">
            <Icon name="ph:share-bold" class="size-5 text-gray-400 group-hover/share:text-pink-500 transition-colors duration-200" />
          </button>
          <button class="w-9 h-9 rounded-full hover:bg-pink-100 transition-colors duration-200 group/heart flex items-center justify-center">
            <Icon name="ph:heart-bold" class="size-5 text-pink-400 group-hover/heart:text-pink-600 transition-colors duration-200" />
          </button>
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
    id: number
    author: {
      id: number
      name: string
    }
    content?: string
    source?: {
      title: string
    }
    sourceInfo?: string
    creator?: {
      id: number
      name: string
      email: string
    }
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['updated'])

const { authState } = useAuth()

const isEditing = ref(false)

const canEdit = computed(() => {
  return authState.value.isLoggedIn && 
         props.post && 
         props.post.creator && 
         authState.value.user?.id === props.post.creator.id
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
</script>

<style>
.icon {
  @apply transition delay-150 duration-300 ease-in-out hover:scale-125
}
</style>
