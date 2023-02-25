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
    <i v-if="isDark" class="fa-solid fa-moon fa-lg"></i>
    <i v-else class="fa-solid fa-sun fa-lg"></i>
  </button>
</template>
