<template>
  <div>
    <p class="mb-5 !mt-0 text-stone-600 text-sm !leading-normal">
      If you don't have account in the app, you can create one here!
    </p>

    <p v-if="errorMessage" class="text-sm my-3 text-red-500">{{ errorMessage }}</p>

    <VeeForm @submit="createAccount" v-slot="{ values, errors }" :validation-schema="schema">
      <VeeField label="Name" name="name" v-model="newAccount.name" v-slot="{ field }">
        <InputField v-bind="field" label="Name" />
      </VeeField>
      <VeeField name="email" v-model="newAccount.email" v-slot="{ field }">
        <InputField v-bind="field" type="email" label="Mail" />
      </VeeField>
      <VeeField name="password" v-model="newAccount.password" v-slot="{ field }">
        <InputField v-bind="field" type="password" label="Password" />
      </VeeField>
      <VeeField name="confirm_password" v-model="confirmPassword" v-slot="{ field }">
        <InputField v-bind="field" type="password"  label="Confirm password" />
      </VeeField>
      <div class="flex justify-end mt-5">
        <Button :loading="loading">Create account</Button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import * as yup from "yup";

interface NewAccount {
  email: string
  password: string
  name: string
}

const newAccount: NewAccount = reactive({
  email: '',
  password: '',
  name: ''
})

const errorMessage = ref('')
const loading = ref(false)
const confirmPassword = ref('')

const schema = {
  name: yup.string().required().min(3, 'this must be least 3 characters'),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirm_password: (value: string) => {
    if (value === newAccount.password) {
      return true
    }

    return 'Passwords do not match'
  }
};


const createAccount = async (): Promise<void> => {

  if (newAccount.password !== confirmPassword.value) {
    errorMessage.value = 'Confirm password and password do not match'
    return
  }

  try {
    loading.value = true

    const res = await $fetch('/api/register', {
      method: 'POST',
      body: newAccount
    })

    console.log(res)
  } catch (e) {
    if (e.status === 400) {
      errorMessage.value = 'Missing credentials'
    }
    if (e.status === 401) {
      errorMessage.value = 'User already exist'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>