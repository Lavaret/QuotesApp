<template>
  <div>
    <p class="mb-5 !mt-0 text-stone-600 text-sm !leading-normal">
      You can access additional functionalities after login in to the app.
    </p>

    <p v-if="successMessage" class="text-sm my-3 text-green-600">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-sm my-3 text-red-500">{{ errorMessage }}</p>

    <VeeForm @submit="handleLogin" v-slot="{ values, errors }" :validation-schema="schema">
      <VeeField name="mail" type="email" v-model="loginForm.email" v-slot="{ field }">
        <InputField v-bind="field" label="Mail" />
      </VeeField>
      <VeeField name="password" type="password" v-model="loginForm.password" v-slot="{ field }">
        <InputField v-bind="field" label="Password" />
      </VeeField>
        <div class="flex justify-end mt-5">
          <Button :loading="loading">Log in</Button>
        </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

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