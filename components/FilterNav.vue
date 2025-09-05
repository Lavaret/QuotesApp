<template>
  <div class="bg-white/60 backdrop-blur-sm border border-pink-100 rounded-xl p-4 shadow-sm mb-6">
    <div class="flex flex-col gap-4">
      <!-- Top Row: Label and Clear Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:funnel" class="size-5 text-gray-600" />
          <h3 class="font-semibold text-gray-800">Filters</h3>
        </div>
        
        <button 
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 text-sm"
          title="Clear all filters"
        >
          <Icon name="ph:x" class="size-4" />
          <span>Clear</span>
        </button>
      </div>
      
      <!-- Filter Options Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Authors Filter -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Icon name="ph:user" class="size-4 text-blue-500" />
              Authors
            </label>
            <span v-if="selectedAuthors.length > 0" class="text-xs text-blue-600 font-medium">
              {{ selectedAuthors.length }} selected
            </span>
          </div>
          <div class="max-h-40 overflow-y-auto space-y-2 bg-gray-50/50 rounded-lg p-3 border border-gray-200">
            <label 
              v-for="author in availableAuthors" 
              :key="author.id"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-white/80 cursor-pointer transition-colors group"
            >
              <input 
                type="checkbox"
                :value="author.id"
                v-model="selectedAuthors"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span class="flex-1 text-sm text-gray-700 group-hover:text-gray-900">{{ author.name }}</span>
              <span class="text-xs text-gray-400 group-hover:text-gray-600">({{ author.count }})</span>
            </label>
            <div v-if="availableAuthors.length === 0" class="text-sm text-gray-500 text-center py-2">
              No authors available
            </div>
          </div>
        </div>
        
        <!-- Sources Filter -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Icon name="ph:book" class="size-4 text-green-500" />
              Sources
            </label>
            <span v-if="selectedSources.length > 0" class="text-xs text-green-600 font-medium">
              {{ selectedSources.length }} selected
            </span>
          </div>
          <div class="max-h-40 overflow-y-auto space-y-2 bg-gray-50/50 rounded-lg p-3 border border-gray-200">
            <label 
              v-for="source in availableSources" 
              :key="source.id"
              class="flex items-center gap-2 p-2 rounded-md hover:bg-white/80 cursor-pointer transition-colors group"
            >
              <input 
                type="checkbox"
                :value="source.id"
                v-model="selectedSources"
                class="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span class="flex-1 text-sm text-gray-700 group-hover:text-gray-900">{{ source.title }}</span>
              <span class="text-xs text-gray-400 group-hover:text-gray-600">({{ source.count }})</span>
            </label>
            <div v-if="availableSources.length === 0" class="text-sm text-gray-500 text-center py-2">
              No sources available
            </div>
          </div>
        </div>
        
        <!-- Favorites Filter -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Icon name="ph:heart" class="size-4 text-pink-500" />
            Special Filters
          </label>
          <div class="space-y-2">
            <button 
              @click="toggleFavoritesFilter"
              :class="[
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm',
                showFavoritesOnly 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200'
              ]"
              title="Filter by favorites"
            >
              <Icon 
                :name="showFavoritesOnly ? 'ph:heart-fill' : 'ph:heart'" 
                :class="[
                  'size-4 transition-all duration-200',
                  showFavoritesOnly ? 'text-white' : 'text-pink-400'
                ]" 
              />
              <span>Favorites Only</span>
              <span v-if="showFavoritesOnly && favoritesCount > 0" class="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {{ favoritesCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Active Filter Summary -->
      <div v-if="hasActiveFilters" class="pt-3 border-t border-pink-100">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <div class="flex items-center gap-1 text-gray-600">
            <Icon name="ph:info" class="size-4" />
            <span>Active filters:</span>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <span v-if="showFavoritesOnly" class="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
              <Icon name="ph:heart-fill" class="size-3" />
              Favorites
            </span>
            
            <span v-if="selectedAuthors.length > 0" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              <Icon name="ph:user" class="size-3" />
              {{ selectedAuthors.length }} author{{ selectedAuthors.length > 1 ? 's' : '' }}
            </span>
            
            <span v-if="selectedSources.length > 0" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              <Icon name="ph:book" class="size-3" />
              {{ selectedSources.length }} source{{ selectedSources.length > 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  id: number
  name: string
  count: number
}

interface Source {
  id: number
  title: string
  count: number
}

interface Props {
  showFavoritesOnly?: boolean
  favoritesCount?: number
  selectedAuthors?: number[]
  selectedSources?: number[]
  availableAuthors?: Author[]
  availableSources?: Source[]
}

interface Emits {
  (e: 'update:showFavoritesOnly', value: boolean): void
  (e: 'update:selectedAuthors', value: number[]): void
  (e: 'update:selectedSources', value: number[]): void
  (e: 'clearFilters'): void
}

const props = withDefaults(defineProps<Props>(), {
  showFavoritesOnly: false,
  favoritesCount: 0,
  selectedAuthors: () => [],
  selectedSources: () => [],
  availableAuthors: () => [],
  availableSources: () => []
})

const emit = defineEmits<Emits>()

// Two-way binding for authors filter
const selectedAuthors = computed({
  get: () => props.selectedAuthors,
  set: (value) => emit('update:selectedAuthors', value)
})

// Two-way binding for sources filter
const selectedSources = computed({
  get: () => props.selectedSources,
  set: (value) => emit('update:selectedSources', value)
})

const hasActiveFilters = computed(() => {
  return props.showFavoritesOnly || 
         props.selectedAuthors.length > 0 || 
         props.selectedSources.length > 0
})

const toggleFavoritesFilter = () => {
  emit('update:showFavoritesOnly', !props.showFavoritesOnly)
}

const clearAllFilters = () => {
  emit('clearFilters')
}
</script>

