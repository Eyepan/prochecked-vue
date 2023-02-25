<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentProject, projects } = storeToRefs(useUserStore());
const loading = ref(false);

if (projects.value.length > 0) {
  currentProject.value = projects.value[0];
}

async function deleteProject() {}
</script>

<template>
  <div class="w-full">
    <Spinner v-show="loading" class="absolute top-3 left-3" />
    <div class="flex justify-between items-center m-2">
      <p class="text-5xl">{{ currentProject.title }}</p>
      <button class="hover:text-red-500" @click="deleteProject()">
        <i class="fa fa-trash fa-xl"></i>
      </button>
    </div>
    <p class="text-xs">Project ID: {{ currentProject.id }}</p>
    <div class="w-full h-1 bg-[var(--color-1)] dark:bg-[var(--color-5)]"></div>
    <p>Project Description: {{ currentProject.description }}</p>
  </div>
</template>
