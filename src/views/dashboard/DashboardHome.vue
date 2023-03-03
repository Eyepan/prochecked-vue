<script setup lang="ts">
// get all projects
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/appStore";
import { onMounted, ref } from "vue";
import type Task from "@/models/task.model";
import { getAllUserTasks } from "@/utils/utils";
import Chart from "chart.js/auto";

const { projects, currentUser } = storeToRefs(useUserStore());
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);
const chart = ref<Chart>();

onMounted(async () => {
  if (currentUser.value) {
    tasks.value = await getAllUserTasks(currentUser.value.user_id);
  }
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
  chart.value = new Chart("chart", {
    type: "bar",
    data: {
      labels: ["Completed", "Incomplete"],
      datasets: [
        {
          label: "Tasks",
          data: [completedTasks.value.length, incompleteTasks.value.length],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<template>
  <div class="flex flex-row justify-between">
    <div class="">
      <div class="text-xl">Total tasks to do</div>
      <div class="text-2xl">{{ incompleteTasks.length }}</div>
    </div>
    <div class="text-right">
      <div class="text-xl">Total tasks done</div>
      <div class="text-2xl">{{ completedTasks.length }}</div>
    </div>
  </div>
  <div id="chart">
    <canvas></canvas>
  </div>
</template>
