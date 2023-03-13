<script setup lang="ts">
import {
  addTaskToProject,
  getProjectById,
  getTasksOfProject,
  completeTask,
  deleteTask,
  deleteProject,
  getUserProjects,
  incompleteTask,
} from "@/utils/utils";

import LoadingProgressIndicator from "@/components/LoadingProgressIndicator.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import type Task from "@/models/task.model";
import type Project from "@/models/project.model";
import { vAutoAnimate } from "@formkit/auto-animate";
import PieChart from "@/components/PieChart.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import ErrorDisplayer from "@/components/ErrorDisplayer.vue";

const loading = ref(false);
const router = useRouter();
const { currentUser, projects } = storeToRefs(useUserStore());
const route = useRoute();
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);
const currentProject = ref<Project>({
  project_id: "",
  user_id: "",
  title: "",
  description: undefined,
  created_at: "",
  deadline: "",
});
const showAddTaskModal = ref(false);
const showDeleteProjectModal = ref(false);
const priorities = ["Low", "Medium", "High", "Do it right now"];
const taskTitle = ref("");
const taskDescription = ref("");
const taskPriority = ref(1);
const taskDueDate = ref("");
const dataToChart = ref<Array<{ value: number; color: string; label: string }>>(
  []
);
const invalidProjectId = ref(false);
const invalidTaskId = ref(false);

onMounted(async () => {
  loading.value = true;
  let currentProjectId: string;
  if (typeof route.params.id === "string") {
    currentProjectId = route.params.id;
  } else {
    currentProjectId = "";
    invalidProjectId.value = true;
  }
  const projectResponse = await getProjectById(
    currentUser.value.user_id,
    currentProjectId
  );
  if (typeof projectResponse !== "number") {
    currentProject.value = projectResponse;
  } else {
    invalidProjectId.value = true;
  }
  const tasksResponse = await getTasksOfProject(
    currentUser.value.user_id,
    currentProject.value.project_id
  );
  if (typeof tasksResponse !== "number") {
    tasks.value = tasksResponse;
  } else {
    invalidProjectId.value = true;
  }
  taskDueDate.value = new Date(currentProject.value.deadline)
    .toISOString()
    .split("T")[0];
  dataToChart.value = [
    {
      value: 1,
      color: "var(--graph-1)",
      label: "Urgent",
    },
    {
      value: 1,
      color: "var(--graph-2)",
      label: "High",
    },
    {
      value: 1,
      color: "var(--graph-3)",
      label: "Medium",
    },
    {
      value: 1,
      color: "var(--graph-4)",
      label: "Low",
    },
  ];
  loading.value = false;
});

watch(tasks, () => {
  completedTasks.value = tasks.value.filter((task) => task.completed);
  completedTasks.value.sort((a, b) => b.priority - a.priority);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  incompleteTasks.value.sort((a, b) => b.priority - a.priority);
  dataToChart.value = [
    {
      value: incompleteTasks.value.filter((task) => task.priority === 3).length,
      color: "var(--graph-4)",
      label: "Urgent",
    },
    {
      value: incompleteTasks.value.filter((task) => task.priority === 2).length,
      color: "var(--graph-3)",
      label: "High",
    },
    {
      value: incompleteTasks.value.filter((task) => task.priority === 1).length,
      color: "var(--graph-2)",
      label: "Medium",
    },
    {
      value: incompleteTasks.value.filter((task) => task.priority === 0).length,
      color: "var(--graph-1)",
      label: "Low",
    },
  ];
});

async function handleDeleteProject() {
  if (currentProject.value) {
    await deleteProject(
      currentUser.value.user_id,
      currentProject.value?.project_id
    );
    const p = await getUserProjects(currentUser.value.user_id);
    if (typeof p !== "number") {
      projects.value = p;
    } else {
      invalidProjectId.value = true;
    }
  }
  await router.replace("/dashboard");
}

async function handleAddTask() {
  // This code sucks, you know it and I know it. I'll fix it later.
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
    const tasksResponse = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
    if (typeof tasksResponse !== "number") {
      tasks.value = tasksResponse;
    } else {
      invalidProjectId.value = true;
    }
  }
  taskTitle.value = "";
  taskDescription.value = "";
  taskPriority.value = 1;
  taskDueDate.value = new Date(currentProject.value.deadline)
    .toISOString()
    .split("T")[0];
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
    const tasksResponse = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
    if (typeof tasksResponse !== "number") {
      tasks.value = tasksResponse;
    } else {
      invalidProjectId.value = true;
    }
  }
  loading.value = false;
}

async function handleIncompleteTask(task_id: string) {
  loading.value = true;
  if (currentProject.value) {
    await incompleteTask(
      currentUser.value.user_id,
      currentProject.value?.project_id,
      task_id
    );
    const tasksResponse = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
    if (typeof tasksResponse !== "number") {
      tasks.value = tasksResponse;
    } else {
      invalidProjectId.value = true;
    }
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
    const tasksResponse = await getTasksOfProject(
      currentUser.value.user_id,
      currentProject.value.project_id
    );
    if (typeof tasksResponse !== "number") {
      tasks.value = tasksResponse;
    } else {
      invalidProjectId.value = true;
    }
  }
  loading.value = false;
}
</script>

<template>
  <ErrorDisplayer v-if="invalidProjectId" error="Invalid Project ID" />
  <ErrorDisplayer v-if="invalidTaskId" error="Invalid Task ID" />
  <!-- magical code, don't touch -->
  <div
    v-if="showAddTaskModal"
    class="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center"
  >
    <form
      @submit.prevent="handleAddTask()"
      class="relative outline py-10 rounded-xl bg-[var(--color-4)] dark:bg-[var(--color-2)] flex flex-col gap-4 items-center justify-center"
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
      <div v-if="taskTitle.length > 40" class="text-red-500">
        Task title shouldn't exceed 40 characters
      </div>
      <textarea
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
          <label for="due date">Due Date</label>
          <input
            id="due date"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            :max="
              currentProject
                ? new Date(currentProject.deadline).toISOString().split('T')[0]
                : ''
            "
            v-model="taskDueDate"
            class="p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        :disabled="taskTitle.length > 40"
        class="btn-primary m-0 w-5/6"
      >
        Add Task
      </button>
    </form>
  </div>
  <div
    v-if="showDeleteProjectModal"
    class="flex flex-col gap-2 text-center items-center justify-center absolute w-screen top-0 bottom-0 left-0 right-0 bg-red-500 z-50"
  >
    <i class="fa-solid fa-warning text-9xl"></i>
    <div class="text-3xl">
      Do you really want to delete
      <div class="text-5xl font-black">{{ currentProject.title }}</div>
    </div>
    <div class="flex flex-row gap-2">
      <button
        class="btn-primary bg-red-700 p-4 px-10"
        @click="
          handleDeleteProject();
          showDeleteProjectModal = false;
        "
        :disabled="loading"
      >
        Yes
      </button>
      <button
        class="btn-primary bg-green-700 p-4 px-10"
        @click="showDeleteProjectModal = false"
        :disabled="loading"
      >
        No
      </button>
    </div>
  </div>

  <div
    v-auto-animate
    class="w-full"
    :style="{
      opacity: showAddTaskModal ? 0.2 : 1,
    }"
  >
    <LoadingProgressIndicator v-if="loading" class="absolute top-10" />
    <!-- title section -->
    <div class="flex flex-row items-center justify-between py-2">
      <div class="">
        <div class="text-4xl md:text-6xl font-black">
          {{ currentProject ? currentProject.title : "Loading..." }}
        </div>
        <div class="text-md md:text-l">
          {{ currentProject ? currentProject.description : "Loading..." }}
        </div>
      </div>
      <div class="flex gap-5 items-center">
        <i
          class="fa-solid fa-pen fa-xl cursor-pointer"
          @click="$router.replace('/edit-project/' + currentProject.project_id)"
        ></i>
        <i
          class="fa-solid fa-trash fa-xl hover:text-red-500 cursor-pointer"
          @click="showDeleteProjectModal = true"
        ></i>
      </div>
    </div>

    <!-- completion section -->
    <div class="text-xl">
      Tasks completion percentage:
      {{
        tasks.length !== 0
          ? Math.floor(
              ((tasks.length - incompleteTasks.length) / tasks.length) * 100
            )
          : 0
      }}%
      {{
        (tasks.length - incompleteTasks.length) / tasks.length === 1 ? "🎉" : ""
      }}
      <ProgressBar
        v-auto-animate
        class="w-full rounded-xl"
        :value="
          tasks.length !== 0
            ? ((tasks.length - incompleteTasks.length) / tasks.length) * 100
            : 0
        "
        color="var(--color-3)"
      />
      Days left:
      {{
        currentProject
          ? Math.max(
              0,
              Math.floor(
                (new Date(currentProject.deadline).valueOf() -
                  new Date().valueOf()) /
                  86400000
              )
            )
          : "Loading..."
      }}
    </div>
    <!-- tasks section -->
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
              ? new Date(currentProject.created_at).toDateString()
              : "Loading..."
          }}
        </div>
        <div class="text-l">
          Deadline at
          {{
            currentProject
              ? new Date(currentProject.deadline).toDateString()
              : "Loading..."
          }}
        </div>
      </div>
    </div>

    <!-- task list -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div class="outline p-4 rounded-xl">
        <div class="text-2xl">Completed Tasks</div>
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
                {{ priorities[task.priority] }}
                {{ task.due_date.substring(0, 10) }}
                {{ task.completed ? "Completed" : "Not completed" }}
              </div>
            </div>
            <div class="flex flex-row gap-3 justify-between">
              <div
                @click="handleIncompleteTask(task.task_id)"
                class="text-center cursor-pointer rounded-xl"
              >
                <i class="fa-solid fa-undo fa-xl"></i>
              </div>
              <div
                @click="handleDeleteTask(task.task_id)"
                class="text-center cursor-pointer rounded-xl"
              >
                <i class="fa-solid fa-trash fa-xl hover:text-red-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col outline p-4 rounded-xl">
        <div class="text-2xl">Tasks To Do</div>
        <div
          class="py-1"
          v-for="task in incompleteTasks"
          :style="{ color: task.completed ? '#00dd00' : '#ff0000' }"
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
              class="text-center cursor-pointer rounded-xl"
            >
              <i class="fa-solid fa-check fa-xl"></i>
            </div>
            <div
              @click="handleDeleteTask(task.task_id)"
              class="text-center cursor-pointer rounded-xl"
            >
              <i class="fa-solid fa-trash fa-xl hover:text-red-500"></i>
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
      <div class="flex-row items-center justify-center outline p-4 rounded-xl">
        <div class="text-2xl">Tasks Priority Analysis</div>
        <PieChart v-if="incompleteTasks.length > 0" :data="dataToChart" />
        <div v-else class="text-m">
          No tasks currently incomplete for project.
          <div class="text-xs">Add one to see the task chart.</div>
        </div>
      </div>
      <div class="flex-row items-center justify-center outline p-4 rounded-xl">
        <div class="text-2xl">Task Descriptions</div>
        <div class="text-lg" v-for="task in tasks">
          <div class="" v-if="task.description">
            {{ task.title }}:
            <div class="text-sm">
              {{ task.description ? task.description : "None" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 540 lines of freshly baked bullshit. I dedicate all of this code to my girlfriend,  -->
<!-- who will support me and my dog once this gets released to the public -->
