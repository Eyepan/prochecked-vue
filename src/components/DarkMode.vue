<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    @click="toggleDark()"
    type="button"
    class="absolute bottom-10 right-10 bg-red z-10 rounded-full hover:rotate-45 bg-[var(--color-1)] dark:bg-[var(--color-5)] w-10 aspect-square flex justify-center items-center"
  >
    <i
      v-if="isDark"
      class="fa-solid text-[var(--color-5)] dark:text-[var(--color-1)] fa-moon fa-lg"
    ></i>
    <i
      v-else
      class="fa-solid text-[var(--color-5)] dark:text-[var(--color-1)] fa-sun fa-lg"
    ></i>
  </button>
</template>
