<template>
  <div class="text-right px-6 pt-3 pb-2">
    <PopoverRoot>
      <PopoverTrigger >
        Log in
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
              <p class="mb-5 !mt-0 text-stone-600 text-sm !leading-normal">
                You can access additional functionalities after login in to the app.
              </p>
              <InputField label="Mail" name="mail" type="email" v-model="login.email" />
              <InputField label="Password" name="password" type="password" v-model="login.password" />
              <div class="flex justify-end mt-5">
                <Button @click="() => console.log(login)">Log in</Button>
              </div>
            </TabsContent>
            <TabsContent
                class="grow p-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                value="tab2"
            >
              <p class="mb-5 !mt-0 text-stone-600 text-sm !leading-normal">
                If you don't have account in the app, you can create one here!
              </p>
              <InputField label="Name" name="name" type="text" v-model="newAccount.name" />
              <InputField label="Email" name="email" type="email" v-model="newAccount.email" />
              <InputField label="Password" name="password" type="password" v-model="newAccount.password" />
              <InputField label="Confirm password" name="confirm_password" type="password"/>
              <div class="flex justify-end mt-5">
                <Button>Create account</Button>
              </div>
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

</template>

<style>

</style>
<script setup lang="ts">
import InputField from "~/components/InputField.vue";
import { reactive } from 'vue'
import {PopoverContent, PopoverPortal, PopoverRoot, TabsContent} from "reka-ui";

interface LoginCredentials {
  email: string
  password: string
}

interface NewAccount {
  email: string
  password: string
  name: string
}

const login: LoginCredentials = reactive({
  email: '',
  password: '',
})

const newAccount: NewAccount = reactive({
  email: '',
  password: '',
  name: ''
})
</script>