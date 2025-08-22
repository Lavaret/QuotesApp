<template>
  <div class="min-h-full py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Your Quotes Space
          </h1>
          <p class="text-gray-600 text-lg">Discover, save, and share wisdom from around the world</p>
        </div>
        
        <div class="flex justify-center">
          <button 
            @click="addNewQuote = true" 
            class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            :disabled="addNewQuote"
          >
            <Icon name="ph:plus-circle" class="size-5" />
            Add New Quote
          </button>
        </div>
      </div>

      <!-- Quotes Container -->
      <div class="space-y-6" ref="container">
        <QuoteForm 
          v-if="addNewQuote" 
          @cancel="handleNewQuoteCancel"
          @success="handleNewQuoteSuccess"
        />
        
        <!-- Display actual posts from database -->
        <Quote 
          v-for="post in posts" 
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
        
        <!-- Fallback message if no posts -->
        <div v-if="!posts || posts.length === 0" class="text-center py-16">
          <div class="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-12 max-w-md mx-auto">
            <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Icon name="icon-park-outline:quote" class="size-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">No quotes yet</h3>
            <p class="text-gray-600 mb-6">Start building your collection of inspiring quotes!</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import autoAnimate from "@formkit/auto-animate"

const container = ref() // we need a DOM node

const { data: posts, refresh: refreshPosts } = await useFetch('/api/posts')

const addNewQuote = ref(false)

const handleNewQuoteCancel = () => {
  addNewQuote.value = false
}

const handleNewQuoteSuccess = async () => {
  // Refresh the posts list when a new quote is created
  await refreshPosts()
  // The QuoteForm component will handle closing itself after success
}

const handleQuoteUpdated = async () => {
  // Refresh the posts list when a quote is updated
  await refreshPosts()
}

onMounted(() => {
  autoAnimate(container.value)
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
