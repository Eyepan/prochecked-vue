<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate";
import Spinner from "@/components/Spinner.vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import {
  addTaskToProject,
  deleteProject,
  getTasksOfProject,
  getUserProjects,
} from "@/utils/utils";
import { useRouter } from "vue-router";
const { currentProject, projects, currentUser, currentTasks } = storeToRefs(
  useUserStore()
);
const loading = ref(false);
const tryingToDelete = ref(false);
const router = useRouter();

async function deleteCurrentProject() {
  loading.value = true;
  deleteProject(currentUser.value.user_id, currentProject.value.project_id);
  const response = await getUserProjects(currentUser.value.user_id);
  if (typeof response === "number") {
    // TODO: handle wrong stuff
  } else {
    projects.value = response;
  }
  router.replace("/dashboard");
  loading.value = false;
}

const title = ref("");
const description = ref("");
const due_date = ref("");
const priority = ref(0);
const completed = ref(0);
const showAddTaskModal = ref(false);

onMounted(async () => {
  const response = await getTasksOfProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  if (typeof response === "number") {
    //TODO: handle this
  } else {
    currentTasks.value = response;
  }
});

if (projects.value.length > 0 && currentProject.value.project_id === "") {
  currentProject.value = projects.value[0];
}

async function handleAddTask() {
  await addTaskToProject(
    currentUser.value.user_id,
    currentProject.value.project_id,
    title.value,
    description.value,
    due_date.value,
    priority.value,
    completed.value
  );
  const response = await getTasksOfProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  if (typeof response === "number") {
    //TODO: handle this
  } else {
    currentTasks.value = response;
  }
}
</script>

<template>
  <div v-auto-animate class="w-full h-full">
    <div
      v-if="tryingToDelete"
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
                deleteCurrentProject();
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

    <Spinner v-if="loading" class="absolute top-3 left-3" />
    <div class="flex justify-between items-center">
      <p class="text-5xl">{{ currentProject.title }}</p>
      <button class="hover:text-red-500" @click="tryingToDelete = true">
        <i class="fa fa-trash fa-xl"></i>
      </button>
    </div>
    <p class="text-xs">Project ID: {{ currentProject.project_id }}</p>
    <div class="w-full h-1 bg-[var(--color-1)] dark:bg-[var(--color-5)]"></div>
    <div class="flex flex-row justify-between">
      <div>Created: {{ currentProject.created_at.substring(0, 10) }}</div>
      <div>Deadline: {{ currentProject.deadline.substring(0, 10) }}</div>
    </div>
    <p v-if="currentProject.description !== ''">
      {{ currentProject.description }}
    </p>
    <p v-else>No description available</p>
    <p v-else>Project completed: No</p>

    <!-- card for tasks -->
    <div v-auto-animate class="flex gap-5">
      <div class="relative w-1/2 mt-4 outline rounded-lg p-4 h-1/2">
        <p class="text-xl">Tasks</p>
        <div v-if="currentTasks.length > 0" v-for="task in currentTasks">
          {{ task.title }}
        </div>
        <div v-else>No tasks available for current project. Create one?</div>
        <button @click="showAddTaskModal = !showAddTaskModal">
          <i class="absolute bottom-8 right-5 fa-solid fa-plus fa-xl"></i>
        </button>
        <form v-if="showAddTaskModal" class="">
          <input type="text" placeholder="Task Name" class="p-2" required />
          <input type="text" placeholder="Task Name" class="p-2" />
        </form>
      </div>
      <div class="relative w-1/2 mt-4 outline rounded-lg p-4 h-1/2">
        <p class="text-xl">Timechart</p>
      </div>
    </div>
  </div>
</template>
