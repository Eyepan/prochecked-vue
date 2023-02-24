<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="min-h-screen p-6 md:p-8">
    <p class="text-5xl md:text-7xl font-extrabold">Pro-Checked</p>
    <p class="text-l md:text-xl font-bold">
      The easy way to organize a project
    </p>

    <p class="text-l md:text-xl mt-10 w-3/4">
      Design your next project with the confidence of Pro-Checked. An open
      source Project Management tool that makes management simple and powerful
    </p>

    <RouterLink
      to="/signup"
      class="mt-20 m-2 p-4 rounded-xl bg-[#B23A48] hover:bg-[#FCB9B2] hover:text-[#8C2F39]"
    >
      Get started!
    </RouterLink>
    <button
      class="mt-20 m-2 p-4 rounded-xl bg-white dark:bg-black hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
    >
      <i class="fa fa-github p-1"></i>
      View on GitHub
    </button>
  </section>
</template>
