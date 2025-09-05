<template>
  <div class="space-y-4">
    <!-- Welcome message -->
    <div class="text-center mb-6">
      <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
        <Icon name="ph:user-circle-fill" class="size-6 text-white" />
      </div>
      <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">Welcome Back!</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
        Sign in to access all features and save your quotes permanently.
      </p>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm transition-colors duration-200">
      <div class="flex items-center gap-2">
        <Icon name="ph:check-circle-fill" class="size-4 text-green-600 dark:text-green-400" />
        {{ successMessage }}
      </div>
    </div>
    
    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm transition-colors duration-200">
      <div class="flex items-center gap-2">
        <Icon name="ph:warning-circle-fill" class="size-4 text-red-600 dark:text-red-400" />
        {{ errorMessage }}
      </div>
    </div>

    <!-- Login Form -->
    <VeeForm @submit="handleLogin" v-slot="{ values, errors }" :validation-schema="schema" class="space-y-5">
      <!-- Email Field -->
      <VeeField name="mail" type="email" v-model="loginForm.email" v-slot="{ field }">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Email Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="ph:envelope" class="size-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              v-bind="field"
              type="email"
              class="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 transition-all duration-200 shadow-sm"
              placeholder="Enter your email"
              :disabled="loading"
            />
          </div>
          <VeeErrorMessage name="mail" class="text-red-600 dark:text-red-400 text-sm transition-colors duration-200" />
        </div>
      </VeeField>
      
      <!-- Password Field -->
      <VeeField name="password" v-model="loginForm.password" v-slot="{ field }">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="ph:lock" class="size-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              v-bind="field"
              :type="showPassword ? 'text' : 'password'"
              class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 transition-all duration-200 shadow-sm"
              placeholder="Enter your password"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              :disabled="loading"
            >
              <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="size-5" />
            </button>
          </div>
          <VeeErrorMessage name="password" class="text-red-600 dark:text-red-400 text-sm transition-colors duration-200" />
        </div>
      </VeeField>
      
      <!-- Submit Button -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
        >
          <Icon v-if="loading" name="line-md:loading-loop" class="size-5" />
          <Icon v-else name="ph:sign-in" class="size-5" />
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const { login: authLogin } = useAuth()
const validateEmail = yup.string().required().email();
const validatePassword = yup.string().required();

const schema = {
  mail: yup.string().required().email(),
  password: yup.string().required()
};

interface LoginCredentials {
  email: string
  password: string
}

const loginForm: LoginCredentials = reactive({
  email: '',
  password: '',
})

const handleLogin = async (): Promise<void> => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  try {
    loading.value = true

    const res = await $fetch('/api/login', {
      method: 'POST',
      body: loginForm
    })

    // Login successful
    if (res.token && res.user) {
      authLogin(res.token, res.user)
      successMessage.value = 'Login successful! Welcome back!'
      
      // Clear the form
      loginForm.email = ''
      loginForm.password = ''
      
      // Close the popover after successful login
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (e: any) {
    if (e.status === 400) {
      errorMessage.value = 'Missing credentials'
    } else if (e.status === 401) {
      errorMessage.value = 'Login credentials are incorrect'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>