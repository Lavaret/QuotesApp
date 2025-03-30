<template>
  <div class="border border-stone-300 m-auto rounded p-3 mx-3 shadow">
    <div class="flex justify-end gap-2 text-xl">
      <slot name="icons">
        <Icon name="solar:share-bold" class="icon cursor-pointer" style="color: black" />
        <Icon name="solar:heart-bold" class="icon cursor-pointer" style="color: hotpink" />
      </slot>
    </div>
    <div class="text-left text-xl m-5">
      <Icon name="ri:double-quotes-l" class="text-stone-500"/>
      <slot name="content"/>
    </div>
    <div class="flex justify-end gap-2 items-center" v-if="$slots.author">
      <Icon name="teenyicons:minus-solid" class="text-stone-500 text-lg"/>
      <div>
        <slot name="author"/>
      </div>
    </div>
    <div class="text-right text-stone-600 text-sm">
      <slot name="source"/>
    </div>
  </div>
</template>
<style>
.icon {
  @apply transition delay-150 duration-300 ease-in-out hover:scale-125
}
</style>