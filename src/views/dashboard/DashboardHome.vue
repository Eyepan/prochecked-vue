<script setup lang="ts">
// DRUNK PAN WROTE THIS. NOBODY TOUCH THIS.
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/appStore";
import { onMounted, ref, watch } from "vue";
import type Task from "@/models/task.model";
import { getAllUserTasks } from "@/utils/utils";
import PieChart from "@/components/PieChart.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { getIncrementalAffirmation } from "@/utils/affirmations";
import ErrorDisplayer from "@/components/ErrorDisplayer.vue";
import { useRouter } from "vue-router";

const { projects, currentUser } = storeToRefs(useUserStore());
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);
const priorities = ["Low", "Medium", "High", "Do it right now"];
const loading = ref(false);
const invalidTaskId = ref(false);
onMounted(async () => {
  loading.value = true;
  if (currentUser.value.user_id !== "") {
    const tasksResponse = await getAllUserTasks(currentUser.value.user_id);
    if (typeof tasksResponse !== "number") {
      tasks.value = tasksResponse;
    } else {
      invalidTaskId.value = true;
    }
  } else {
    useRouter().replace("/login");
  }
  // dear future me, please forgive me. I can't even begin to express how deeply sorry i am
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  loading.value = true;
});
watch(tasks, () => {
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
});
</script>

<template>
  <ErrorDisplayer v-if="invalidTaskId" error="Invalid Task ID" />
  <div class="text-5xl md:text-7xl font-black mb-5">Dashboard</div>
  <div class="text-xl md:text-2xl lg:text-4xl">
    {{ getIncrementalAffirmation() }}
  </div>
  <div
    v-if="projects.length > 0"
    class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5"
  >
    <div class="w-full h-full outline rounded-xl p-4">
      <div class="text-xl m-2 text-center">Total Tasks completion</div>

      <PieChart
        v-if="tasks.length > 0"
        :data="[
          {
            value: completedTasks.length,
            color: 'var(--graph-1)',
            label: 'Completed',
          },
          {
            value: incompleteTasks.length,
            color: 'var(--graph-2)',

            label: 'Not Completed',
          },
        ]"
      />
      <div v-else class="">No tasks created, create one!</div>
    </div>
    <div class="w-full h-full outline rounded-xl p-4">
      <!-- task priorities -->
      <div class="text-xl m-2 text-center">Incomplete Tasks Analysis</div>
      <PieChart
        v-if="tasks.length > 0"
        :data="[
          {
            value: incompleteTasks.filter((task) => task.priority === 0).length,
            color: 'var(--graph-1)',
            label: 'Low',
          },
          {
            value: incompleteTasks.filter((task) => task.priority === 1).length,
            color: 'var(--graph-2)',
            label: 'Medium',
          },
          {
            value: incompleteTasks.filter((task) => task.priority === 2).length,
            color: 'var(--graph-3)',
            label: 'High',
          },
          {
            value: incompleteTasks.filter((task) => task.priority === 3).length,
            color: 'var(--graph-4)',
            label: 'Do it right now',
          },
        ]"
      />
      <div v-else class="">No tasks created, create one!</div>
    </div>
    <div class="w-full h-full outline rounded-xl p-4">
      <div class="text-xl m-2 text-center">Projects Analysis</div>
      <div class="" v-for="project in projects">
        <div class="text-lg">{{ project.title }}</div>
        <!-- show remaining tasks count -->
        <div class="text-sm">
          {{
            tasks.filter(
              (task) =>
                task.project_id === project.project_id && !task.completed
            ).length
          }}
          <!-- either show task or tasks based on value -->
          {{
            tasks.filter(
              (task) =>
                task.project_id === project.project_id && !task.completed
            ).length === 1
              ? "task"
              : "tasks"
          }}
          remaining, out of
          {{
            tasks.filter((task) => task.project_id === project.project_id)
              .length
          }}
        </div>
        <ProgressBar
          :value="
            (completedTasks.filter(
              (task) => task.project_id === project.project_id
            ).length /
              tasks.filter((task) => task.project_id === project.project_id)
                .length) *
            100
          "
          color="var(--color-3)"
        ></ProgressBar>
      </div>
    </div>
    <!-- upcoming project deadlines -->
    <div class="w-full h-full outline rounded-xl p-4">
      <div class="text-xl m-2 text-center">Upcoming Project Deadlines</div>
      <div class="flex flex-col">
        <div
          class="flex flex-row justify-between items-center rounded-xl"
          v-for="project in projects.sort((a, b) => {
            return (
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          })"
          :key="project.project_id"
        >
          <div class="flex flex-col">
            <div class="text-lg">{{ project.title }}</div>
            <div class="text-sm">
              {{ new Date(project.deadline).toDateString() }}
            </div>
          </div>
          <!-- days left as a progress bar -->
          <ProgressBar
            class="w-2/5"
            :value="
              ((new Date(project.deadline).valueOf() - new Date().valueOf()) *
                100) /
              (new Date(project.deadline).valueOf() -
                new Date(project.created_at).valueOf())
            "
            color="var(--color-3)"
          />
        </div>
      </div>
    </div>

    <div class="w-full h-full outline rounded-xl p-4">
      <div class="text-xl m-2 text-center">Upcoming Task Deadlines</div>
      <div class="flex flex-col">
        <div
          class="flex flex-row justify-between items-center rounded-xl"
          v-for="task in tasks
            .filter((task) => !task.completed)
            .sort((a, b) => {
              return (
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
              );
            })"
          :key="task.task_id"
        >
          <div class="flex-col">
            <p class="text-lg inline">
              {{ task.title }}
            </p>
            <p class="text-sm inline">: {{ priorities[task.priority] }}</p>
            <div class="text-sm">
              Project:
              {{
                projects.find(
                  (project) => project.project_id === task.project_id
                )?.title
              }}
            </div>
          </div>
          <div class="text-sm">{{ task.due_date }}</div>
          <!-- project name -->
        </div>
      </div>
    </div>
    <div class="w-full h-full outline rounded-xl p-4">
      <div class="text-xl m-2 text-center">Completed Task Deadlines</div>
      <div class="flex flex-col">
        <div
          class="flex flex-row justify-between items-center rounded-xl"
          v-for="task in tasks
            .filter((task) => task.completed)
            .sort((a, b) => {
              return (
                new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
              );
            })"
          :key="task.task_id"
        >
          <div class="text-lg">{{ task.title }}</div>
          <div class="text-sm">{{ task.due_date }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-md mt-10">
    Aw, you haven't created any projects... yet. Create one now!
  </div>
</template>
