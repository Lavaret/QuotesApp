<script setup lang="ts">
interface Post {
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
  private?: boolean
  creator?: {
    id: number
    name: string
    email: string
  }
}

interface Props {
  post?: Post | null  // If provided, form is in edit mode
  isVisible?: boolean // Whether the form should be shown
}

interface Emits {
  cancel: []
  submit: [data: FormData]
  success: []
}

interface FormData {
  content: string
  author: string
  source: string
  additionalInfo: string
  private: boolean
}

const props = withDefaults(defineProps<Props>(), {
  post: null,
  isVisible: true
})

const emit = defineEmits<Emits>()

const { authState } = useAuth()
const { saveTempQuote, getTempQuote, clearTempQuote, hasTempQuote, saveTempPost } = useTempQuote()

// Form state
const form = ref<FormData>({
  content: '',
  author: '',
  source: '',
  additionalInfo: '',
  private: false
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

// Computed properties
const isEditMode = computed(() => !!props.post)
const submitButtonText = computed(() => isEditMode.value ? 'Save Changes' : 'Save Quote')
const submitLoadingText = computed(() => isEditMode.value ? 'Saving...' : 'Saving...')

// Watch for prop changes to populate form in edit mode
watch(() => props.post, (newPost) => {
  if (newPost) {
    form.value = {
      content: newPost.content || '',
      author: newPost.author?.name || '',
      source: newPost.source?.title || '',
      additionalInfo: newPost.sourceInfo || '',
      private: newPost.private || false
    }
  }
}, { immediate: true })

// Watch visibility to reset form when shown
watch(() => props.isVisible, (visible) => {
  if (visible && !isEditMode.value) {
    // Load temporary quote if available and user is not logged in
    const tempQuote = getTempQuote()
    if (tempQuote && !authState.value.isLoggedIn) {
      form.value = {
        content: tempQuote.content,
        author: tempQuote.author,
        source: tempQuote.source,
        additionalInfo: tempQuote.additionalInfo,
        private: tempQuote.private
      }
    } else {
      resetForm()
    }
  }
})

// Watch form changes to save to localStorage when not authenticated
watch(form, (newForm) => {
  if (!authState.value.isLoggedIn && !isEditMode.value) {
    // Debounce the save to avoid too frequent updates
    if (newForm.content.trim() || newForm.author.trim() || newForm.source.trim() || newForm.additionalInfo.trim()) {
      saveTempQuote({
        content: newForm.content,
        author: newForm.author,
        source: newForm.source,
        additionalInfo: newForm.additionalInfo,
        private: newForm.private
      })
    }
  }
}, { deep: true, immediate: false })

// Watch auth state to handle login/logout transitions
watch(() => authState.value.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    // User just logged in - restore temp quote if it exists
    const tempQuote = getTempQuote()
    if (tempQuote) {
      form.value = {
        content: tempQuote.content,
        author: tempQuote.author,
        source: tempQuote.source,
        additionalInfo: tempQuote.additionalInfo,
        private: tempQuote.private
      }
      // Clear the temp quote since user can now save it properly
      clearTempQuote()
    }
  }
})

const resetForm = () => {
  form.value = {
    content: '',
    author: '',
    source: '',
    additionalInfo: '',
    private: false
  }
  message.value = { text: '', type: '' }
  // Clear temp quote when resetting form
  clearTempQuote()
}

const cancel = () => {
  resetForm()
  emit('cancel')
}

const submit = async () => {
  // Validate required fields
  if (!form.value.content.trim() || !form.value.author.trim() || !form.value.source.trim()) {
    message.value = {
      text: 'Content, author, and source are required',
      type: 'error'
    }
    return
  }

  // If user is not logged in, save as temporary quote
  if (!authState.value.isLoggedIn) {
    try {
      loading.value = true
      message.value = { text: '', type: '' }
      
      // Save to localStorage as temporary post
      const tempPost = saveTempPost({
        content: form.value.content,
        author: form.value.author,
        source: form.value.source,
        additionalInfo: form.value.additionalInfo,
        private: form.value.private
      })
      
      if (tempPost) {
        message.value = {
          text: 'Quote saved locally on your device! Log in to save it permanently.',
          type: 'success'
        }
        
        // Clear the draft since we saved it as a temp post
        clearTempQuote()
        
        // Emit success and submit events
        emit('success')
        emit('submit', form.value)
        
        // Close form after a delay
        setTimeout(() => {
          resetForm()
          emit('cancel')
        }, 2000)
      }
    } catch (error) {
      message.value = {
        text: 'Failed to save quote locally',
        type: 'error'
      }
    } finally {
      loading.value = false
    }
    return
  }

  // User is logged in - save to server
  try {
    loading.value = true
    message.value = { text: '', type: '' }

    const requestData = isEditMode.value 
      ? { id: props.post!.id, ...form.value }
      : form.value

    const method = isEditMode.value ? 'PUT' : 'POST'
    const successText = isEditMode.value ? 'Quote updated successfully!' : 'Quote created successfully!'

    await $fetch('/api/posts', {
      method,
      headers: {
        'Authorization': `Bearer ${authState.value.token}`
      },
      body: requestData
    })

    message.value = {
      text: successText,
      type: 'success'
    }

    // Emit success and submit events
    emit('success')
    emit('submit', form.value)
    
    // Clear temp quote on successful save
    clearTempQuote()
    
    // Close form after a delay
    setTimeout(() => {
      if (!isEditMode.value) {
        resetForm()
      }
      emit('cancel')
    }, 1500)

  } catch (error: any) {
    let errorMessage = isEditMode.value ? 'Failed to update quote' : 'Failed to create quote'
    
    if (error.status === 401) {
      errorMessage = 'You must be logged in to manage quotes'
    } else if (error.status === 403) {
      errorMessage = 'You can only edit your own quotes'
    } else if (error.status === 404) {
      errorMessage = 'Quote not found'
    } else if (error.status === 400) {
      errorMessage = 'Please fill in all required fields'
    } else if (error.data?.statusMessage) {
      errorMessage = error.data.statusMessage
    }
    
    message.value = {
      text: errorMessage,
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-pink-100 dark:border-gray-600 rounded-md p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
    <!-- Decorative gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white/50 to-rose-50/50 dark:from-gray-800/50 dark:via-gray-800/50 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    <!-- Content wrapper -->
    <div class="relative z-10">
      <!-- Temporary Quote Indicator -->
      <div v-if="!authState.isLoggedIn && (form.content.trim() || form.author.trim() || form.source.trim() || form.additionalInfo.trim())" class="mb-4">
        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div class="bg-gradient-to-r from-amber-400 to-yellow-400 p-2 rounded-full">
            <Icon name="heroicons:eye-slash-20-solid" class="size-4 text-white" />
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-amber-800 mb-1">Temporary Quote</h4>
            <p class="text-xs text-amber-700">This quote is saved locally on your device. Please log in to save it permanently.</p>
          </div>
        </div>
      </div>
      
      <!-- Form -->
      <div class="space-y-4 max-w-2xl mx-auto">
        <!-- Success/Error Messages -->
        <div v-if="message.text" :class="[
          'text-sm p-3 rounded-md transition-colors duration-200',
          message.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-800'
        ]">
          {{ message.text }}
        </div>

        <!-- Quote Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Quote Content *</label>
          <textarea
              v-model="form.content"
              class="quote-input w-full p-3 rounded-xl min-h-[120px] resize-none"
              placeholder="Enter the quote content here..."
              :disabled="loading"
          ></textarea>
        </div>

        <!-- Author -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Author *</label>
          <input
              v-model="form.author"
              type="text"
              class="quote-input w-full p-3 rounded-xl"
              placeholder="Enter author name"
              :disabled="loading"
          />
        </div>

        <!-- Source and Additional Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Source *</label>
            <input
                v-model="form.source"
                type="text"
                class="quote-input w-full p-3 rounded-xl"
                placeholder="Book, movie, speech, etc."
                :disabled="loading"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Additional Info</label>
            <input
                v-model="form.additionalInfo"
                type="text"
                class="quote-input w-full p-3 rounded-xl"
                placeholder="Page number, year, etc."
                :disabled="loading"
            />
          </div>
        </div>

        <!-- Private Quote Toggle -->
        <div class="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Private Quote</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">Private quotes are only visible to you</p>
          </div>
          <button
              @click="form.private = !form.private"
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                form.private ? 'bg-pink-500 dark:bg-pink-600' : 'bg-gray-200 dark:bg-gray-600'
              ]"
              :disabled="loading"
          >
            <span :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              form.private ? 'translate-x-6' : 'translate-x-1'
            ]"></span>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
              @click="cancel"
              type="button"
              class="quote-btn quote-btn-cancel"
              :disabled="loading"
          >
            Cancel
          </button>
          <button
              @click="submit"
              type="button"
              class="quote-btn quote-btn-save"
              :disabled="loading || !form.content.trim() || !form.author.trim() || !form.source.trim()"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <Icon name="line-md:loading-loop" class="size-4" />
              {{ submitLoadingText }}
            </span>
            <span v-else class="flex items-center gap-2">
              <Icon :name="authState.isLoggedIn ? 'line-md:confirm' : 'heroicons:device-phone-mobile'" class="size-4" />
              {{ authState.isLoggedIn ? submitButtonText : 'Save Locally' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Quote form input styling */
.quote-input {
  @apply bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-pink-200 dark:border-gray-600 rounded-xl transition-all duration-200 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-900/50 shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100;
}

.quote-input::placeholder {
  @apply text-sm text-gray-400 dark:text-gray-500;
}

.quote-input:disabled {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-700;
}

/* Button styling with enhanced pink/black theme */
.quote-btn {
  @apply px-8 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl;
}

.quote-btn-cancel {
  @apply bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white focus:ring-gray-500;
}

.quote-btn-save {
  @apply bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white focus:ring-pink-400;
}
</style>