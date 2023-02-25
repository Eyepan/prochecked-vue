<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    @click="toggleDark()"
    type="button"
    class="absolute bottom-10 right-10 bg-red z-10 rounded-lg hover:rotate-45"
  >
    <img
      v-if="!isDark"
      src="@/assets/moon.png"
      class="w-8 rounded-full p-[0.375rem]"
      alt=""
    />
    <img
      v-else
      src="@/assets/sun.png"
      class="w-8 rounded-full p-[0.375rem] bg-[var(--color-4)]"
      alt=""
    />
  </button>
</template>
