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
  completeTask,
  deleteTask,
} from "@/utils/utils";
import { useRouter } from "vue-router";
import type Task from "@/models/task.model";
const { currentProject, projects, currentUser, currentTasks } = storeToRefs(
  useUserStore()
);
const loading = ref(false);
const tryingToDelete = ref(false);
const router = useRouter();

const title = ref("");
const description = ref("");
const due_date = ref("");
const priority = ref(0);
const showAddTaskModal = ref(false);
const incompleteTasks = ref(
  currentTasks.value.reduce((acc: any[], task: { completed: number }) => {
    if (task.completed === 0) {
      acc.push(task);
    }
    return acc;
  }, [] as Task[])
);
const completedTasks = ref(
  currentTasks.value.reduce((acc: any[], task: { completed: number }) => {
    if (task.completed === 1) {
      acc.push(task);
    }
    return acc;
  }, [] as Task[])
);

const priorities = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Do it right now",
};

watch(currentProject, async () => {
  const response = await getTasksOfProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  if (typeof response === "number") {
    currentTasks.value = [];
  } else {
    currentTasks.value = await response;
  }
  if (currentTasks.value.length === 0) {
    incompleteTasks.value = await [];
    completedTasks.value = await [];
  }
  completedTasks.value = await currentTasks.value.filter(
    (task) => task.completed
  );
  incompleteTasks.value = await currentTasks.value.filter(
    (task) => !task.completed
  );
});

watch(currentTasks, async () => {
  incompleteTasks.value = currentTasks.value.reduce(
    (acc: any[], task: { completed: number }) => {
      if (task.completed === 0) {
        acc.push(task);
      }
      return acc;
    },
    [] as Task[]
  );
  completedTasks.value = currentTasks.value.reduce(
    (acc: any[], task: { completed: number }) => {
      if (task.completed === 1) {
        acc.push(task);
      }
      return acc;
    },
    [] as Task[]
  );
  // sort completed and incomplete tasks by priority
  if (currentTasks.value.length === 0) {
    incompleteTasks.value = [];
    completedTasks.value = [];
  }
  completedTasks.value = currentTasks.value.filter((task) => task.completed);
  incompleteTasks.value = currentTasks.value.filter((task) => !task.completed);
});

if (projects.value.length > 0 && currentProject.value.project_id === "") {
  currentProject.value = projects.value[0];
}

async function handleAddTask() {
  loading.value = true;
  await addTaskToProject(
    currentUser.value.user_id,
    currentProject.value.project_id,
    title.value,
    description.value,
    due_date.value,
    priority.value,
    0
  );
  const response = await getTasksOfProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  if (typeof response === "number") {
    currentTasks.value = [];
    incompleteTasks.value = [];
    completedTasks.value = [];
  } else {
    currentTasks.value = response;
    completedTasks.value = [];
    incompleteTasks.value = [];
  }
  loading.value = false;
}

async function completeCurrentTask(task_id: string) {
  loading.value = true;
  const response = await completeTask(
    currentUser.value.user_id,
    currentProject.value.project_id,
    task_id
  );
  if (typeof response === "number") {
    // TODO: handle wrong stuff
  } else {
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
  loading.value = false;
}

async function deleteCurrentTask(task_id: string) {
  loading.value = true;
  const response = await deleteTask(
    currentUser.value.user_id,
    currentProject.value.project_id,
    task_id
  );
  if (response !== 200) {
  } else {
    const response = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
    if (typeof response === "number") {
      currentTasks.value = [];
      incompleteTasks.value = [];
      completedTasks.value = [];
    } else {
      currentTasks.value = response;
    }
  }
  loading.value = false;
}

async function deleteCurrentProject() {
  loading.value = true;
  await deleteProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  const response = await getUserProjects(currentUser.value.user_id);
  if (typeof response === "number") {
    // TODO: handle wrong stuff
  } else {
    projects.value = response;
  }

  router.replace("/dashboard");
  loading.value = false;
}
</script>

<!-- :class="{ opacity: showAddTaskModal ? '0.5' : '1' }" -->
<template>
  <div v-auto-animate>
    <Spinner v-if="loading" class="absolute right-2 top-2" />
    <div
      v-if="showAddTaskModal"
      class="rounded-lg absolute flex items-center justify-center top-0 left-0 w-full h-screen z-50"
    >
      <div
        class="rounded-lg outline bg-[var(--color-5)] dark:bg-[var(--color-1)] p-10 w-1/2"
      >
        Add new task to {{ currentProject.title }}
        <i
          class="ml-5 fa-solid fa-close float-right hover:text-red-500 cursor-pointer"
          @click="showAddTaskModal = false"
        ></i>
        <form
          @submit.prevent="
            handleAddTask();
            showAddTaskModal = false;
          "
          class="flex mt-10 gap-5 flex-col"
        >
          <input
            v-model="title"
            type="text"
            class="p-3"
            placeholder="Task Name"
            required
          />
          <input
            v-model="description"
            type="text"
            class="p-3"
            placeholder="Task Description"
          />
          <input
            v-model="due_date"
            type="date"
            class="p-3"
            placehlder="Due date"
            required
          />
          <label for="priority">Priority</label>
          <select
            v-model="priority"
            id="priority"
            class="-[var(--color-5)] dark:bg-[var(--color-1)]"
            required
          >
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
            <option value="3">Do it right now</option>
          </select>
          <button type="submit" class="btn-primary">Create my task</button>
        </form>
      </div>
    </div>
    <div
      v-auto-animate
      class="w-full h-full"
      :style="{ opacity: showAddTaskModal ? '0.5' : '1' }"
    >
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
      <!-- darken the background if show task modal is true -->

      <div class="flex justify-between items-center">
        <p class="text-5xl">{{ currentProject.title }}</p>
        <button class="hover:text-red-500" @click="tryingToDelete = true">
          <i class="fa fa-trash fa-xl"></i>
        </button>
      </div>
      <div class="h-2"></div>
      <p class="text-s">Project ID: {{ currentProject.project_id }}</p>
      <div class="h-2"></div>

      <div
        class="w-full h-1 bg-[var(--color-1)] dark:bg-[var(--color-5)]"
      ></div>
      <div class="h-2"></div>
      <div class="flex flex-row justify-between">
        <div>Created: {{ currentProject.created_at.substring(0, 10) }}</div>
        <div>Deadline: {{ currentProject.deadline.substring(0, 10) }}</div>
      </div>
      <p v-if="currentProject.description !== ''">
        {{ currentProject.description }}
      </p>
      <p v-else>No description available</p>
      <p v-else>Project completed: No</p>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- card for tasks -->
        <div class="relative mt-4 outline rounded-lg p-4 min-h-[200px]">
          <p class="text-xl">Tasks to do</p>
          <div v-if="currentTasks.length > 0" v-for="task in incompleteTasks">
            <div class="m-3 flex flex-row justify-between">
              <div :style="{ color: task.completed ? '#00FF00' : '#FF0000' }">
                {{ task.title }}
                <div
                  class="text-sm"
                  :style="{ color: task.completed ? 'green' : 'red' }"
                >
                  {{ task.description }} {{ task.due_date }}
                  {{ priorities[task.priority] }}
                  {{ task.completed ? "Completed" : "Not completed" }}
                </div>
              </div>
              <i
                class="fa-solid fa-check hover:text-[var(--color-3)]"
                @click="completeCurrentTask(task.task_id)"
              ></i>
            </div>
          </div>
          <div v-else>No tasks available for current project.</div>
          <i
            @click="showAddTaskModal = true"
            class="absolute bottom-5 right-5 fa-solid fa-plus text-xl cursor-pointer hover:text-green-500"
          >
          </i>
        </div>
        <!-- card for done tasks -->
        <div class="relative mt-4 outline rounded-lg p-4">
          <p class="text-xl">Tasks done</p>
          <div
            class="m-3"
            v-if="currentTasks.length > 0"
            v-for="task in completedTasks"
          >
            <div class="flex flex-row justify-between">
              <div :style="{ color: task.completed ? '#00FF00' : '#FF0000' }">
                {{ task.title }}
                <div
                  class="text-sm"
                  :style="{ color: task.completed ? 'green' : 'red' }"
                >
                  {{ task.description }} {{ task.due_date }}
                  {{ priorities[task.priority] }}
                  {{ task.completed ? "Completed" : "Not completed" }}
                </div>
              </div>
              <i
                @click="deleteCurrentTask(task.task_id)"
                class="fa-solid fa-trash hover:text-red-500"
              ></i>
            </div>
          </div>
          <div v-else>
            <p>¯\_(ツ)_/¯</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
