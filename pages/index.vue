<template>
  <div class="flex m-2">
    <div class="bg-stone-300 w-1/4"></div>
    <div class="bg-stone-200 min-h-32 w-1/2 flex flex-col gap-4">
      <div class="flex justify-between mt-2 p-2">
        <div class="font-bold p-3">
          <h1 class="header-1 ">Welcome to the homepage</h1>
        </div>
        <div>
          <Button icon="pajamas:todo-add" @click="addNewQuote = true">Add quote</Button>
        </div>
      </div>

      <div class="space-y-4" ref="container">
        <Quote v-if="addNewQuote">
          <template #icons>
            <Icon @click="handleFormSubmit" name="line-md:circle-twotone-to-confirm-circle-transition" :style="{color: 'hotpink'}" class="icon cursor-pointer size-6" />
            <Icon @click="addNewQuote = false" name="line-md:close-circle" class="icon cursor-pointer text-stone-900 size-6" />
          </template>
          <template #content>
            <textarea v-model="newPost.content" class="input w-full p-3 rounded-lg" placeholder="I have no special talent. I am only passionately curious."></textarea>
          </template>
          <template #author>
            <input v-model="newPost.author" type="text" class="input p-2" placeholder="Albert Einstein"/>
          </template>
          <template #source>
            <div class="flex justify-end gap-2 my-2 flex-wrap">
              <input v-model="newPost.source" type="text" class="input p-2" placeholder="Source"/>
              <input v-model="newPost.additionalInfo" type="text" class="input p-2" placeholder="Additional info"/>
            </div>
          </template>
        </Quote>
        <Quote>
          <template #author>
            Albert Einstein
          </template>
          <template #content>
            If you can't explain it simply, you don't understand it well enough.
          </template>
        </Quote>

        <Quote>
          <template #author>
            Lara Croft
          </template>
          <template #content>
            Czasami odwaga jednego może przeważyć nad tchórzostwem wielu.
          </template>
        </Quote>

        <Quote>
          <template #author>
            Dr Sayer
          </template>
          <template #content>
            Przepraszam, gdybyś miał rację, tobym się z Tobą zgodził.
          </template>
          <template #source>
            przebudzenia (film)
          </template>
        </Quote>

        <Quote>
          <template #author>
            Joseph Townsend
          </template>
          <template #content>
            W zasadzie tylko głód potrafi pobudzić ubogich do pracy.
          </template>
          <template #source>
            Głód s. 245
          </template>
        </Quote>

        <Quote>
          <template #content>
            Jeszcze jedną niezwykłą cechą jego wykładów było to, że nie unikał słów "nie wiemy". "Nie wiemy" było kierunkowskazem
            do odkrycia nowej prawdy, a nie wstydliwym przyznaniem się do niewiedzy.
          </template>
          <template #source>
            Ukochane równanie profesora
          </template>
        </Quote>

        <Quote>
          <template #content>
            Im więcej możesz tym skromniej używaj.
          </template>
          <template #author>
            Marek Aureliusz
          </template>
        </Quote>

        <Quote>
          <template #content>
            Ani skarby ani armia ani władza nie ocalą władcy, na tronie bezpieczni są tylko Ci, których otacza miłość.
          </template>
          <template #author>
            Marek Aureliusz
          </template>
        </Quote>

      </div>
    </div>
    <div class="bg-stone-300 w-1/4"></div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import autoAnimate from "@formkit/auto-animate"

const container = ref() // we need a DOM node

const { data: posts } = await useFetch('/api/posts')

const newPost = ref({
  content: '',
  author: '',
  source: '',
  additionalInfo: ''
})

async function handleFormSubmit() {
  const res = await $fetch('/api/posts', {
    method: 'POST',
    body: newPost.value
  })

  console.log(res)
}

const addNewQuote = ref(false)

onMounted(() => {
  autoAnimate(container.value)
})
</script>

<style>
.input {
  @apply bg-transparent border border-2 border-stone-300 rounded-md
}
</style>
