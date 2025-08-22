<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-3">
          <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
            <Icon name="icon-park-outline:quote" class="size-7 text-white" />
          </div>
          <div>
            <h1 class="font-bold text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              QuotesApp
            </h1>
            <p class="text-xs text-gray-500 -mt-1">Wisdom Collection</p>
          </div>
        </div>
        
        <!-- Show user info and logout if logged in -->
        <div v-if="authState.isLoggedIn" class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-700">Welcome back!</p>
            <p class="text-xs text-pink-600 font-medium">{{ authState.user?.name }}</p>
          </div>
          
          <!-- Token Expiration Counter -->
          <div v-if="tokenTimer?.isActive.value" class="flex items-center h-[2.6rem] gap-2 px-3 py-1 bg-gray-50 rounded-lg border">
            <Icon name="ph:clock" class="size-4 text-gray-500" />
            <div class="text-right">
              <p class="text-xs text-gray-500 leading-tight">Session expires in</p>
              <p :class="[tokenTimer.getTimeColor(tokenTimer.timeRemaining.value), 'text-sm font-mono font-bold leading-tight']">
                {{ tokenTimer.formatTime(tokenTimer.timeRemaining.value) }}
              </p>
            </div>
          </div>
          
          <button 
            @click="handleLogout" 
            class="bg-gradient-to-r from-gray-800 to-gray-900 h-[2.6rem] flex items-center hover:from-gray-900 hover:to-black text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
          >
            <Icon name="ph:sign-out" class="size-4 mr-2 block" />
            Logout
          </button>
        </div>
    
        <!-- Show login popover if not logged in -->
        <PopoverRoot v-else>
          <PopoverTrigger class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            <Icon name="ph:user-circle" class="size-4 mr-2" />
            Sign In
          </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent class="bg-stone-50 rounded-lg shadow mr-6">
          <TabsRoot
              class="flex flex-col w-full sm:w-[300px]"
              default-value="tab1"
          >
            <TabsList
                class="relative shrink-0 flex border-b border-stone-200"
                aria-label="Manage your account"
            >
              <TabsIndicator class="absolute px-8 left-0 h-[2px] bottom-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] translate-y-[1px] rounded-full transition-[width,transform] duration-300">
                <div class="w-full h-full bg-pink-400" />
              </TabsIndicator>
              <TabsTrigger
                  class="px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none  rounded-tl-md  hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
                  value="tab1"
              >
                Log in
              </TabsTrigger>
              <TabsTrigger
                  class="px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none  rounded-tr-md hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
                  value="tab2"
              >
                Sign in
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
          <PopoverArrow class="fill-white stroke-gray-200" />
        </PopoverContent>
      </PopoverPortal>
        </PopoverRoot>
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
