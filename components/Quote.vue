<template>
  <div class="border border-stone-400 m-auto rounded p-3 mx-3">
    <div class="flex justify-end gap-2 text-xl">
      <Icon name="solar:share-bold" class="cursor-pointer" style="color: black" />
      <Icon name="solar:heart-bold" class="cursor-pointer" style="color: hotpink" />
    </div>
    <div class="text-left text-xl m-5">
      <Icon name="ri:double-quotes-l" class="text-stone-500"/>
      <slot name="content"/>
    </div>
    <div class="flex justify-end gap-2 items-center">
      <Icon name="teenyicons:minus-solid" class="text-stone-500 text-lg"/>
      <div>
        <slot name="author"/>
      </div>
    </div>
    <div class="text-right">
      <slot name="source"/>
    </div>
  </div>
</template>
