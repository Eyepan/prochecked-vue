<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="p-6 pt-10 md:p-10 lg:p-20">
    <img
      class="mt-5 ml-3 rounded-3xl drop-shadow-lg invisible md:visible float-right w-[calc(50%_-_2rem)]"
      src="@/assets/images/home.png"
      alt=""
    />
    <div class="text-5xl md:text-7xl font-extrabold">ProChecked</div>
    <div class="text-l md:text-xl font-bold">
      Check all the boxes of your project
    </div>

    <div class="text-l md:text-xl m-10 mb-0 ml-0">
      Design your next project with the confidence of Pro-Checked.
    </div>
    <div class="text-m md:text-l m-4 ml-0">
      An open source tool that makes managing a project hassle-free
    </div>
    <div class="lg:mt-20 grid grid-cols-2 md:w-1/2">
      <RouterLink to="/signup" class="btn-primary"> Get started! </RouterLink>

      <RouterLink to="/signin" class="btn-primary bg-[var(--color-2)]">
        Sign-in
      </RouterLink>
      <a
        href="https://github.com/eyepan/prochecked-vue"
        target="_blank"
        class="btn-primary col-span-3 bg-black text-white hover:bg-white hover:text-black"
      >
        <i class="fa fa-github p-1"></i>
        View on GitHub
      </a>
    </div>
  </div>
</template>
