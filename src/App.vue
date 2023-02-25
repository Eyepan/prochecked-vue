<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/userDetails";

const { isLoggedIn, currentUser } = storeToRefs(useUserStore());
const router = useRouter();
if (isLoggedIn.value) {
  router.replace("/dashboard");
} else {
  router.replace("/");
}
</script>

<template>
  <div class="">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
