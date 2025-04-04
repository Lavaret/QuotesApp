<template>
  <button
      class="bg-stone-900 rounded-sm text-white p-3 shadow-md flex gap-2 items-center transition delay-150 duration-300 ease-in-out hover:bg-stone-700"
  >
    <Icon v-if="props.icon" :name="props.icon" class="size-5"/>
    <Icon v-if="loading" :name="'line-md:loading-alt-loop'" class="size-5"/>
    <span><slot/></span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  loading: Boolean,
})

</script>

<style scoped>

</style>