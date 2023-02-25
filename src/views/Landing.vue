<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="lg:m-20">
    <img class="float-right" src="@/assets/images/home.png" alt="" />
    <div class="text-5xl md:text-7xl font-extrabold">Pro-Checked</div>
    <div class="text-l md:text-xl font-bold">
      The easy way to organize a project
    </div>

    <div class="text-l md:text-xl m-10 mb-0 ml-0">
      Design your next project with the confidence of Pro-Checked.
    </div>
    <div class="text-m md:text-l m-4 ml-0">
      An open source tool that makes managing a project hassle-free
    </div>
    <div class="absolute top-2/3">
      <RouterLink to="/signup" class="mt-5 btn-primary">
        Get started!
      </RouterLink>
      <a
        href="https://github.com/eyepan/prochecked-vue"
        target="_blank"
        class="mt-20 m-2 p-4 rounded-xl bg-white dark:bg-black hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
      >
        <i class="fa fa-github p-1"></i>
        View on GitHub
      </a>
      <RouterLink to="/signin" class="mt-5 btn-primary bg-[var(--color-2)]">
        Sign-in
      </RouterLink>
    </div>
  </section>
</template>
