<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function handleBack() {
  router.replace("/home");
}
</script>

<template>
  <div>
    <button @click="handleBack()">
      <i class="fa-solid fa-chevron-left fa-xl"></i>
    </button>
    <p>settings page</p>
  </div>
</template>
