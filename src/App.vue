<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouterView } from "vue-router";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/appStore";
import DarkMode from "./components/DarkMode.vue";

const { isLoggedIn, currentUser } = storeToRefs(useUserStore());
const router = useRouter();
if (isLoggedIn.value) {
  router.replace("/dashboard");
} else {
  router.replace("/");
}
</script>

<template>
  <div>
    <DarkMode class="absolute float-right" />
    <router-view v-slot="{ Component, route }">
      <transition name="fade">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
