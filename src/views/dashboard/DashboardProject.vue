<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate";
import Spinner from "@/components/Spinner.vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const { currentProject, projects, currentUser } = storeToRefs(useUserStore());
const loading = ref(false);
const tryingToDelete = ref(false);
const router = useRouter();
if (projects.value.length > 0) {
  currentProject.value = projects.value[0];
}

async function deleteProject() {
  loading.value = true;
  await axios
    .delete(
      import.meta.env.VITE_API_URL +
        "users/" +
        currentUser.value.id +
        "/projects/" +
        currentProject.value.id
    )
    .then(async () => {
      console.log("Project deleted!");
      await axios
        .get(
          import.meta.env.VITE_API_URL +
            "users/" +
            currentUser.value?.id +
            "/projects"
        )
        .then((response) => {
          projects.value = response.data;
          if (projects.value.length > 0) {
            currentProject.value = projects.value[0];
          }
          console.log(projects.value);
        })
        .catch(() => {
          console.log("no projects available");
          projects.value = [];
          currentProject.value = {
            id: "",
            title: "",
            description: "",
            team_leader_id: "",
            created: "",
            deadline: "",
            completed: false,
          };
          router.push("home");
        });
    })
    .catch((error) => {
      console.log(error);
    });
  loading.value = false;
}
</script>

<template>
  <div v-auto-animate class="w-full">
    <div
      v-if="tryingToDelete"
      :style="{
        opacity: tryingToDelete ? '1' : '0',
      }"
      class="fixed top-0 left-0 right-0 z-50 p-4 w-screen h-screen bg-[var(--color-3)] bg-opacity-80 overflow-hidden"
    >
      <div class="relative w-full h-full flex items-center justify-center">
        <div class="relative">
          <div class="p-6 text-center">
            <i class="fa-solid fa-triangle-exclamation text-9xl"></i>
            <h3 class="text-lg font-normal">
              Are you sure you want to delete this project?
            </h3>
            <p>All your data related to the project will be lost</p>
            <button
              type="button"
              @click="
                deleteProject();
                tryingToDelete = false;
              "
              class="mt-5 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Yes, I'm sure
            </button>
            <button
              @click="tryingToDelete = false"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <Spinner v-show="loading" class="absolute top-3 left-3" />
    <div class="flex justify-between items-center my-2">
      <p class="text-5xl">{{ currentProject.title }}</p>
      <button class="hover:text-red-500" @click="tryingToDelete = true">
        <i class="fa fa-trash fa-xl"></i>
      </button>
    </div>
    <p class="text-xs">Project ID: {{ currentProject.id }}</p>
    <div class="w-full h-1 bg-[var(--color-1)] dark:bg-[var(--color-5)]"></div>
    <p v-if="currentProject.description !== ''">
      Project Description: {{ currentProject.description }}
    </p>
    <p v-else>Project Description: No description available</p>
    <p>Project created: {{ currentProject.created }}</p>
    <p>Project deadline: {{ currentProject.deadline }}</p>
    <p v-if="currentProject.completed">Project completed: Yes</p>
    <p v-else>Project completed: No</p>
  </div>
</template>
