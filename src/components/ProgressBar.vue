<template>
  <svg viewBox="0 0 100 2" class="rounded-xl">
    <rect x="0" y="0" width="100" height="10" fill="#ccc5b9ff" />
    <rect x="0" y="0" :width="progress" height="10" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  value: { type: Number, default: 0 },
  color: { type: String, default: "#eb5e28ff" },
});

const progress = computed(() => {
  return Math.min(Math.max(props.value, 0), 100);
});
</script>
