<script setup lang="ts">

interface Props {
  label: string
  name: string
  type?: string
}

const { label, name, type = 'text' } = defineProps<Props>()

const model = defineModel()
</script>

<template>
  <fieldset class="mb-[15px] w-full flex flex-col justify-start">
    <label
        class="text-xs leading-none mb-2.5 text-green12 block"
        :for="name"
    >{{ label }}</label>
    <input
        :id="name"
        class="bg-stone-50 grow shrink-0 rounded-md px-2.5 text-sm leading-none text-grass11 shadow-[0_0_0_1px] shadow-green7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
        v-model="model"
        :type="type"
    >
  </fieldset>
</template>

<style scoped>

</style>