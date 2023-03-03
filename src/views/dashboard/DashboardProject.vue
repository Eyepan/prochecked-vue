<script setup lang="ts">
import {
  addTaskToProject,
  getProjectById,
  getTasksOfProject,
} from "@/utils/utils";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import type Task from "@/models/task.model";
import type Project from "@/models/project.model";
import { vAutoAnimate } from "@formkit/auto-animate";

const { currentUser } = storeToRefs(useUserStore());
const route = useRoute();
const router = useRouter();
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);
const project = ref<Project>();
const showAddTaskModal = ref(false);

const priorities = ["Low", "Medium", "High", "Do it right now"];

const taskTitle = ref("");
const taskDescription = ref("");
const taskPriority = ref(0);
const taskDueDate = ref("");

onMounted(async () => {
  let currentProjectId: string;
  if (typeof route.params.id === "string") {
    currentProjectId = route.params.id;
  } else {
    throw "Invalid project id";
  }
  project.value = await getProjectById(
    currentUser.value.user_id,
    currentProjectId
  );
  tasks.value = await getTasksOfProject(
    currentUser.value.user_id,
    currentProjectId
  );
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  // sort tasks by priority
  completedTasks.value.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    } else if (a.priority < b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
  incompleteTasks.value.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    } else if (a.priority < b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
});

watch(tasks, () => {
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  completedTasks.value.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    } else if (a.priority < b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
  incompleteTasks.value.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    } else if (a.priority < b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
});

async function handleAddTask() {
  if (project.value) {
    await addTaskToProject(
      currentUser.value.user_id,
      project.value.project_id,
      taskTitle.value,
      taskDescription.value,
      taskDueDate.value,
      taskPriority.value,
      0
    );
    tasks.value = await getTasksOfProject(
      currentUser.value.user_id,
      project.value.project_id
    );
  }
  taskTitle.value = "";
  taskDescription.value = "";
  taskDueDate.value = "";
  taskPriority.value = 0;
  showAddTaskModal.value = false;
}
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
      <div class="text-xl">Add task to {{ project && project.title }}</div>
      <input
        type="text"
        v-model="taskTitle"
        class="p-2 w-5/6"
        placeholder="Task title"
        required
      />
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
      <button type="submit" class="btn-primary m-0 w-5/6">Add Task</button>
    </form>
  </div>
  <div
    v-auto-animate
    class="w-full"
    :style="{
      opacity: showAddTaskModal ? 0.2 : 1,
    }"
  >
    <!-- title section -->
    <div class="flex flex-row items-center justify-between py-2">
      <div class="">
        <div class="text-3xl">{{ project ? project.title : "Loading..." }}</div>
        <div class="text-l">
          {{ project ? project.description : "Loading..." }}
        </div>
      </div>
      <div class="text-right">
        <div class="text-l">
          Created on
          {{ project ? project.created_at.substring(0, 10) : "Loading..." }}
        </div>
        <div class="text-l">
          Deadline at
          {{ project ? project.deadline.substring(0, 10) : "Loading..." }}
        </div>
      </div>
    </div>

    <!-- tasks section -->
    <div class="h-1 w-full bg-white"></div>
    <div class="text-2xl">Tasks</div>
    <div class="text-l">
      {{ tasks ? tasks.length : "Loading..." }} tasks in this project
    </div>

    <!-- task list -->
    <div class="grid grid-cols-2 gap-4">
      <div class="outline p-4 rounded-xl mt-4 overflow-hidden">
        <div class="text-xl">Completed Tasks</div>
        <div
          v-for="task in completedTasks"
          :style="{ color: task.completed ? '#00ff00' : '#ff0000' }"
        >
          <div class="text-l">
            {{ task.title }}
          </div>
          <div class="text-xs">
            {{ task.description }}
            {{ priorities[task.priority] }}
            {{ task.due_date.substring(0, 10) }}
            {{ task.completed ? "Completed" : "Not completed" }}
          </div>
        </div>
      </div>
      <div class="flex flex-col outline p-4 rounded-xl mt-4 overflow-hidden">
        <div class="text-xl">Tasks To Do</div>
        <div
          class="py-1"
          v-for="task in incompleteTasks"
          :style="{ color: task.completed ? '#00ff00' : '#ff0000' }"
        >
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
          @click="showAddTaskModal = true"
          class="text-center my-1 py-2 cursor-pointer w-full rounded-xl hover:bg-[var(--color-2)]"
        >
          <i class="fa-solid fa-add fa-xl"></i>
        </div>
      </div>
    </div>

    <!-- add task button -->
  </div>
</template>
