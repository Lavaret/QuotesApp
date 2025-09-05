<template>
  <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-pink-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex justify-between items-center">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-none">
          <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0">
            <Icon name="icon-park-outline:quote" class="size-5 sm:size-7 text-white" />
          </div>
          <div class="min-w-0">
            <h1 class="font-bold text-lg sm:text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent truncate">
              QuotesApp
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-0.5 sm:-mt-1 transition-colors duration-200 hidden sm:block">
              Wisdom Collection
            </p>
          </div>
        </div>
        
        <!-- Actions Section -->
        <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-110"
            :title="themeLabel"
          >
            <Icon :name="themeIcon" class="size-4 sm:size-5" />
          </button>
          
          <!-- Show user info and logout if logged in -->
          <div v-if="authState.isLoggedIn" class="flex items-center gap-2 sm:gap-4">
            <!-- User info - hidden on mobile, show only name on small screens -->
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Welcome back!</p>
              <p class="text-xs text-pink-600 dark:text-pink-400 font-medium transition-colors duration-200">{{ authState.user?.name }}</p>
            </div>
            
            <!-- Compact user info for small screens -->
            <div class="sm:hidden text-right">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 truncate max-w-24">{{ authState.user?.name }}</p>
            </div>
            
            <!-- Token Expiration Counter - hide on mobile -->
            <div v-if="tokenTimer?.isActive.value" class="hidden md:flex items-center h-[2.6rem] gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
              <Icon name="ph:clock" class="size-4 text-gray-500 dark:text-gray-400" />
              <div class="text-right">
                <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight transition-colors duration-200">Session expires in</p>
                <p :class="[tokenTimer.getTimeColor(tokenTimer.timeRemaining.value), 'text-sm font-mono font-bold leading-tight']">
                  {{ tokenTimer.formatTime(tokenTimer.timeRemaining.value) }}
                </p>
              </div>
            </div>
            
            <!-- Mobile timer indicator (just icon) -->
            <div v-if="tokenTimer?.isActive.value" class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-200" :title="`Session expires in ${tokenTimer.formatTime(tokenTimer.timeRemaining.value)}`">
              <Icon name="ph:clock" class="size-4" :class="tokenTimer.getTimeColor(tokenTimer.timeRemaining.value)" />
            </div>
            
            <button 
              @click="handleLogout" 
              class="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 h-9 sm:h-[2.6rem] flex items-center hover:from-gray-900 hover:to-black dark:hover:from-gray-800 dark:hover:to-gray-900 text-white px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
            >
              <Icon name="ph:sign-out" class="size-4 sm:mr-2 block" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
    
          <!-- Show login popover if not logged in -->
          <PopoverRoot v-else>
            <PopoverTrigger class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 sm:px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base">
              <Icon name="ph:user-circle" class="size-4 sm:mr-2" />
              <span class="hidden sm:inline">Sign In</span>
            </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class="bg-stone-50 dark:bg-gray-800 rounded-lg shadow mx-4 sm:mr-6 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <TabsRoot
              class="flex flex-col w-full max-w-[280px] sm:w-[300px]"
              default-value="tab1"
          >
            <TabsList
                class="relative shrink-0 flex border-b border-stone-200 dark:border-gray-600 transition-colors duration-200"
                aria-label="Manage your account"
            >
              <TabsIndicator class="absolute px-8 left-0 h-[2px] bottom-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] translate-y-[1px] rounded-full transition-[width,transform] duration-300">
                <div class="w-full h-full bg-pink-400" />
              </TabsIndicator>
              <TabsTrigger
                  class="px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-gray-600 dark:text-gray-300 select-none rounded-tl-md hover:text-pink-600 dark:hover:text-pink-400 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 outline-none cursor-default transition-colors duration-200"
                  value="tab1"
              >
                Log in
              </TabsTrigger>
              <TabsTrigger
                  class="px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-gray-600 dark:text-gray-300 select-none rounded-tr-md hover:text-pink-600 dark:hover:text-pink-400 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 outline-none cursor-default transition-colors duration-200"
                  value="tab2"
              >
                Sign up
              </TabsTrigger>
            </TabsList>
            <TabsContent
                class="grow p-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab1"
            >
              <LoginComponent/>
            </TabsContent>
            <TabsContent
                class="grow p-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab2"
            >
              <RegisterComponent />
            </TabsContent>
          </TabsRoot>
<!--          <PopoverClose-->
<!--              class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-grass11 absolute top-[8px] right-[8px] hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"-->
<!--              aria-label="Close"-->
<!--          >-->
<!--          </PopoverClose>-->
            <PopoverArrow class="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-600 transition-colors duration-200" />
        </PopoverContent>
      </PopoverPortal>
          </PopoverRoot>
        </div>
      </div>
    </div>
  </header>
</template>

<style>

</style>
<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, TabsContent } from "reka-ui";

const { authState, logout, initAuth, getTokenTimer } = useAuth()
const { toggleDarkMode, themeIcon, themeLabel, initDarkMode } = useDarkMode()

// Get token timer instance
const tokenTimer = computed(() => getTokenTimer())

const handleLogout = () => {
  logout()
  // Optionally refresh the page or redirect
  window.location.reload()
}

// Initialize auth state when component mounts
onMounted(() => {
  initAuth()
})
</script>
