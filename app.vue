<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-200">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize auth state and dark mode when the app loads
const { initAuth } = useAuth()
const { initDarkMode } = useDarkMode()

onMounted(() => {
  initAuth()
  // Initialize dark mode as early as possible
  initDarkMode()
})
</script>
