// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', 'reka-ui/nuxt'],
  typescript: {
    shim: false, // Poprawia rozpoznawanie komponentów w IDE
  }
})