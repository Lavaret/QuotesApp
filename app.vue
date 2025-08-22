<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize auth state when the app loads
const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>
