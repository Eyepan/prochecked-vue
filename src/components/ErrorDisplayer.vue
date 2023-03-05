<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>

<template>
  <div
    class="flex flex-col gap-2 text-center items-center justify-center absolute w-screen h-screen top-0 bottom-0 left-0 right-0 bg-red-500 z-50"
  >
    <i class="fa-solid fa-warning text-9xl"></i>
    <div class="text-3xl">
      <div class="text-5xl font-black">{{ error }}</div>
    </div>
    <button class="btn-primary" @click="$router.replace('/')">
      Back to safety
    </button>
  </div>
</template>
