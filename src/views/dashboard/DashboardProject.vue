<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const { currentProject, projects, currentUser } = storeToRefs(useUserStore());
const loading = ref(false);
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
  <div class="w-full">
    <Spinner v-show="loading" class="absolute top-3 left-3" />
    <div class="flex justify-between items-center my-2">
      <p class="text-5xl">{{ currentProject.title }}</p>
      <button class="hover:text-red-500" @click="deleteProject()">
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
