<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <button
    @click="
      router.go(-1);
      router.go(0);
    "
  >
    Go back<i class="fa-solid fa-left"></i>
  </button>
  <p>settings page</p>
</template>
