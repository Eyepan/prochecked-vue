<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const { currentUser, isLoggedIn } = storeToRefs(useUserStore());
defineProps<{
  error: string;
}>();
const router = useRouter();
function getToSafety() {
  currentUser.value.user_id = "";
  currentUser.value.email = "";
  currentUser.value.password = "";
  isLoggedIn.value = false;
  localStorage.removeItem("currentUser");
  router.replace("/");
}
</script>

<template>
  <div
    class="flex flex-col gap-2 text-center items-center justify-center absolute w-screen h-screen top-0 bottom-0 left-0 right-0 bg-red-500 z-50"
  >
    <i class="fa-solid fa-warning text-9xl"></i>
    <div class="text-3xl">
      <div class="text-5xl font-black">{{ error }}</div>
    </div>
    <button class="btn-primary" @click="getToSafety()">Back to safety</button>
  </div>
</template>
