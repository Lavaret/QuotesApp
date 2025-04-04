<template>
  <div>
    <p class="mb-5 !mt-0 text-stone-600 text-sm !leading-normal">
      You can access additional functionalities after login in to the app.
    </p>

    <p v-if="errorMessage" class="text-sm my-3 text-red-500">{{ errorMessage }}</p>

    <VeeForm @submit="handleLogin" v-slot="{ values, errors }" :validation-schema="schema">
      <VeeField name="mail" type="email" v-model="login.email" v-slot="{ field }">
        <InputField v-bind="field" label="Mail" />
      </VeeField>
      <VeeField name="password" type="password" v-model="login.password" v-slot="{ field }">
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
const loading = ref(false)
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

const login: LoginCredentials = reactive({
  email: '',
  password: '',
})

const handleLogin = async (): Promise<void> => {
  try {
    loading.value = true

    const res = await $fetch('/api/login', {
      method: 'POST',
      body: login
    })

    console.log(res)
  } catch (e) {
    if (e.status === 400) {
      errorMessage.value = 'Missing credentials'
    }
    if (e.status === 401) {
      errorMessage.value = 'Login credentials are incorrect'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>