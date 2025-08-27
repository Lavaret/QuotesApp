<template>
  <div class="bg-white/60 backdrop-blur-sm border border-pink-100 rounded-xl p-4 shadow-sm mb-6">
    <div class="flex items-center justify-between">
      <!-- Filter Label -->
      <div class="flex items-center gap-2">
        <Icon name="ph:funnel" class="size-5 text-gray-600" />
        <h3 class="font-semibold text-gray-800">Filters</h3>
      </div>
      
      <!-- Filter Options -->
      <div class="flex items-center gap-3">
        <!-- Favorites Filter -->
        <button 
          @click="toggleFavoritesFilter"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm',
            showFavoritesOnly 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
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
          <span>Favorites</span>
          <span v-if="showFavoritesOnly && favoritesCount > 0" class="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {{ favoritesCount }}
          </span>
        </button>
        
        <!-- Clear All Filters -->
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
    </div>
    
    <!-- Active Filter Summary -->
    <div v-if="hasActiveFilters" class="mt-3 pt-3 border-t border-pink-100">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="ph:info" class="size-4" />
        <span>
          Showing 
          <span v-if="showFavoritesOnly" class="font-medium text-pink-600">favorite quotes only</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showFavoritesOnly?: boolean
  favoritesCount?: number
}

interface Emits {
  (e: 'update:showFavoritesOnly', value: boolean): void
  (e: 'clearFilters'): void
}

const props = withDefaults(defineProps<Props>(), {
  showFavoritesOnly: false,
  favoritesCount: 0
})

const emit = defineEmits<Emits>()

const hasActiveFilters = computed(() => {
  return props.showFavoritesOnly
})

const toggleFavoritesFilter = () => {
  emit('update:showFavoritesOnly', !props.showFavoritesOnly)
}

const clearAllFilters = () => {
  emit('clearFilters')
}
</script>

<template>
  <div class="bg-white/60 backdrop-blur-sm border border-pink-100 rounded-xl p-4 shadow-sm mb-6">
    <div class="flex items-center justify-between">
      <!-- Filter Label -->
      <div class="flex items-center gap-2">
        <Icon name="ph:funnel" class="size-5 text-gray-600" />
        <h3 class="font-semibold text-gray-800">Filters</h3>
      </div>
      
      <!-- Filter Options -->
      <div class="flex items-center gap-3">
        <!-- Favorites Filter -->
        <button 
          @click="toggleFavoritesFilter"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm',
            showFavoritesOnly 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
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
          <span>Favorites</span>
          <span v-if="showFavoritesOnly && favoritesCount > 0" class="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {{ favoritesCount }}
          </span>
        </button>
        
        <!-- Clear All Filters -->
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
    </div>
    
    <!-- Active Filter Summary -->
    <div v-if="hasActiveFilters" class="mt-3 pt-3 border-t border-pink-100">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="ph:info" class="size-4" />
        <span>
          Showing 
          <span v-if="showFavoritesOnly" class="font-medium text-pink-600">favorite quotes only</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showFavoritesOnly?: boolean
  favoritesCount?: number
}

interface Emits {
  (e: 'update:showFavoritesOnly', value: boolean): void
  (e: 'clearFilters'): void
}

const props = withDefaults(defineProps<Props>(), {
  showFavoritesOnly: false,
  favoritesCount: 0
})

const emit = defineEmits<Emits>()

const hasActiveFilters = computed(() => {
  return props.showFavoritesOnly
})

const toggleFavoritesFilter = () => {
  emit('update:showFavoritesOnly', !props.showFavoritesOnly)
}

const clearAllFilters = () => {
  emit('clearFilters')
}
</script>
