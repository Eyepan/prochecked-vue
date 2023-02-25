<script setup lang="ts">
import { useUserStore } from "@/stores/appStore";
import { ref } from "vue";
import { storeToRefs } from "pinia";
const { currentProject, projects } = storeToRefs(useUserStore());
if (projects.value.length > 0) {
  currentProject.value = projects.value[0];
}
</script>

<template>
  <div class="w-full">
    <p class="text-5xl">{{ currentProject.title }}</p>
    <p class="text-xs">Project ID: {{ currentProject.id }}</p>
    <div class="w-full h-1 bg-white"></div>
    <p>Project Description: {{ currentProject.description }}</p>
  </div>
</template>
