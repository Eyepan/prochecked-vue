<script setup lang="ts">
// get all projects
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/appStore";
import { onMounted, ref } from "vue";
import type Task from "@/models/task.model";
import { getAllUserTasks } from "@/utils/utils";
import PieChart from "@/components/PieChart.vue";

const { projects, currentUser } = storeToRefs(useUserStore());
const tasks = ref<Task[]>([]);
const completedTasks = ref<Task[]>([]);
const incompleteTasks = ref<Task[]>([]);

onMounted(async () => {
  if (currentUser.value) {
    tasks.value = await getAllUserTasks(currentUser.value.user_id);
  }
  completedTasks.value = tasks.value.filter((task) => task.completed);
  incompleteTasks.value = tasks.value.filter((task) => !task.completed);
});
</script>

<template>
  <div class="flex flex-row justify-between">
    <div class="">
      <div class="text-xl">Total tasks to do</div>
      <div class="text-2xl">{{ incompleteTasks.length }}</div>
    </div>
    <div class="text-center">
      <div class="text-xl">Total tasks done</div>
      <div class="text-2xl">{{ completedTasks.length }}</div>
    </div>

    <div class="text-right">
      <div class="text-xl">Total tasks</div>
      <div class="text-2xl">{{ tasks.length }}</div>
    </div>
  </div>
  <div class="">
    <PieChart
      :data="[
        {
          value: completedTasks.length,
          color: 'var(--color-3)',
          label: 'Completed',
        },
        {
          value: incompleteTasks.length,
          color: 'var(--color-2)',
          label: 'Not Completed',
        },
      ]"
    />
  </div>
</template>
