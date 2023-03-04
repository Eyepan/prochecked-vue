<script setup lang="ts">
import {
  addTaskToProject,
  getProjectById,
  getTasksOfProject,
  completeTask,
  deleteTask,
} from "@/utils/utils";

import Spinner from "@/components/Spinner.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import type Task from "@/models/task.model";
import type Project from "@/models/project.model";
import { vAutoAnimate } from "@formkit/auto-animate";
import { Chart, type ChartConfiguration } from "chart.js/auto";

const loading = ref(false);

const { currentUser } = storeToRefs(useUserStore());
const route = useRoute();
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);
const currentProject = ref<Project>();
const showAddTaskModal = ref(false);

const priorities = ["Low", "Medium", "High", "Do it right now"];

const taskTitle = ref("");
const taskDescription = ref("");
const taskPriority = ref(0);
const taskDueDate = ref("");

onMounted(async () => {
  loading.value = true;
  let currentProjectId: string;
  if (typeof route.params.id === "string") {
    currentProjectId = route.params.id;
  } else {
    throw "Invalid project id";
  }
  currentProject.value = await getProjectById(
    currentUser.value.user_id,
    currentProjectId
  );
  tasks.value = await getTasksOfProject(
    currentUser.value.user_id,
    currentProjectId
  );
  loading.value = false;
  const myChart = new Chart(
    document.getElementById("myChart") as HTMLCanvasElement,
    config
  );
});

watch(tasks, () => {
  completedTasks.value = tasks.value.filter((task) => task.completed);
  completedTasks.value.sort((a, b) => b.priority - a.priority);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  incompleteTasks.value.sort((a, b) => b.priority - a.priority);
});

async function handleDeleteProject() {}

async function handleAddTask() {
  loading.value = true;
  if (currentProject.value) {
    await addTaskToProject(
      currentUser.value.user_id,
      currentProject.value.project_id,
      taskTitle.value,
      taskDescription.value,
      taskDueDate.value,
      taskPriority.value,
      0
    );
    tasks.value = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
  }
  taskTitle.value = "";
  taskDescription.value = "";
  taskDueDate.value = "";
  taskPriority.value = 0;
  showAddTaskModal.value = false;
  loading.value = false;
}

async function handleCompleteTask(task_id: string) {
  loading.value = true;
  if (currentProject.value) {
    await completeTask(
      currentUser.value.user_id,
      currentProject.value?.project_id,
      task_id
    );
    tasks.value = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
  }
  loading.value = false;
}
async function handleDeleteTask(task_id: string) {
  loading.value = true;
  if (currentProject.value) {
    await deleteTask(
      currentUser.value.user_id,
      currentProject.value?.project_id,
      task_id
    );
    tasks.value = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
  }
  loading.value = false;
}
const config: ChartConfiguration<"pie", number[], string> = {
  type: "pie",
  data: {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        label: "Tasks",
        data: [completedTasks.value.length, incompleteTasks.value.length],
        backgroundColor: ["#00ff00", "#ff0000"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
};
</script>

<template>
  <div
    v-auto-animate
    v-if="showAddTaskModal"
    class="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center"
  >
    <form
      @submit.prevent="handleAddTask()"
      class="relative outline w-1/2 h-1/2 rounded-xl bg-[var(--color-4)] dark:bg-[var(--color-2)] flex flex-col gap-4 items-center justify-center"
    >
      <i
        @click="showAddTaskModal = false"
        class="absolute top-10 right-10 fa-solid fa-close fa-xl hover:text-red-500"
      ></i>
      <div class="text-xl">
        Add task to {{ currentProject && currentProject.title }}
      </div>
      <input
        type="text"
        v-model="taskTitle"
        class="p-2 w-5/6"
        placeholder="Task title"
        required
      />
      <div v-if="taskTitle.length > 20" class="text-red-500">
        Task title shouldn't exceed 20 characters
      </div>
      <input
        type="text"
        class="p-2 w-5/6 h-20"
        v-model="taskDescription"
        placeholder="Task description (optional)"
      />
      <div class="grid grid-cols-2 w-5/6 gap-10">
        <div class="flex flex-col items-center justify-center gap-2">
          <label for="priority">Task Priority:</label>
          <select
            v-model="taskPriority"
            id="priority"
            class="bg-[var(--color-5)] dark:bg-[var(--color-1)] p-2 hover:bg-[var(--color-4)] hover:dark:bg-[var(--color-2)]"
          >
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
            <option value="3">Do it right now</option>
          </select>
        </div>
        <div class="flex flex-col items-center justify-center gap-2">
          <label for="duedate">Due Date</label>
          <input id="duedate" type="date" v-model="taskDueDate" class="p-2" />
        </div>
      </div>
      <button
        type="submit"
        :disabled="taskTitle.length > 20"
        class="btn-primary m-0 w-5/6"
      >
        Add Task
      </button>
    </form>
  </div>
  <div
    v-auto-animate
    class="w-full"
    :style="{
      opacity: showAddTaskModal ? 0.2 : 1,
    }"
  >
    <Spinner v-if="loading" />
    <!-- title section -->
    <div class="flex flex-row items-center justify-between py-2">
      <div class="">
        <div class="text-3xl">
          {{ currentProject ? currentProject.title : "Loading..." }}
        </div>
        <div class="text-l">
          {{ currentProject ? currentProject.description : "Loading..." }}
        </div>
      </div>
      <div class="">
        <i
          class="fa-solid fa-trash fa-xl hover:text-red-500 cursor-pointer"
          @click="handleDeleteProject()"
        ></i>
      </div>
    </div>

    <!-- tasks section -->
    <div class="h-1 w-full bg-white"></div>
    <div class="flex items-center justify-between">
      <div class="">
        <div class="text-2xl">Tasks</div>
        <div class="text-l">
          {{ tasks ? tasks.length : "Loading..." }} tasks in this project
        </div>
      </div>
      <div class="text-right">
        <div class="text-l">
          Created on
          {{
            currentProject
              ? currentProject.created_at.substring(0, 10)
              : "Loading..."
          }}
        </div>
        <div class="text-l">
          Deadline at
          {{
            currentProject
              ? currentProject.deadline.substring(0, 10)
              : "Loading..."
          }}
        </div>
      </div>
    </div>

    <!-- task list -->
    <div class="grid grid-cols-2 gap-4">
      <div class="outline p-4 rounded-xl mt-4">
        <div class="text-xl">Completed Tasks</div>
        <div
          v-for="task in completedTasks"
          :style="{ color: task.completed ? '#00ff00' : '#ff0000' }"
        >
          <div class="flex gap-3 justify-between">
            <div class="">
              <div class="text-l w-5/6">
                {{ task.title }}
              </div>
              <div class="text-xs">
                {{ task.description }}
                {{ priorities[task.priority] }}
                {{ task.due_date.substring(0, 10) }}
                {{ task.completed ? "Completed" : "Not completed" }}
              </div>
            </div>
            <div
              @click="handleDeleteTask(task.task_id)"
              class="text-center cursor-pointer rounded-xl hover:bg-[var(--color-2)]"
            >
              <i class="fa-solid fa-trash fa-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col outline p-4 rounded-xl mt-4">
        <div class="text-xl">Tasks To Do</div>
        <div
          class="py-1"
          v-for="task in incompleteTasks"
          :style="{ color: task.completed ? '#00ff00' : '#ff0000' }"
        >
          <div class="flex flex-row gap-3 justify-between">
            <div class="w-5/6">
              <div class="text-l">
                {{ task.title }}
              </div>
              <div class="text-xs">
                <!-- {{ task.description }} -->
                {{ priorities[task.priority] }}
                {{ task.due_date.substring(0, 10) }}
                {{ task.completed ? "Completed" : "Not completed" }}
              </div>
            </div>
            <div
              @click="handleCompleteTask(task.task_id)"
              class="text-center cursor-pointer rounded-xl hover:bg-[var(--color-2)]"
            >
              <i class="fa-solid fa-check fa-xl"></i>
            </div>
            <div
              @click="handleDeleteTask(task.task_id)"
              class="text-center cursor-pointer rounded-xl hover:bg-[var(--color-2)]"
            >
              <i class="fa-solid fa-trash fa-xl"></i>
            </div>
          </div>
        </div>
        <div
          @click="showAddTaskModal = true"
          class="text-center my-1 py-2 cursor-pointer w-full rounded-xl hover:bg-[var(--color-2)]"
        >
          <i class="fa-solid fa-add fa-xl"></i>
        </div>
      </div>
    </div>
    <div class="flex h-1/2 flex-col outline p-4 rounded-xl mt-4">
      TimeChart
      <div>
        <myChart id="myChart" width="200" height="200"></myChart>
      </div>
    </div>
  </div>
</template>
