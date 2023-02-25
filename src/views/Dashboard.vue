<script setup lang="ts">
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/userDetails";
import { storeToRefs } from "pinia";
const { currentUser, projects, isLoggedIn } = storeToRefs(useUserStore());

const router = useRouter();
onMounted(() => {
  axios
    .get(
      import.meta.env.VITE_API_URL +
        "users/" +
        currentUser.value?.id +
        "/projects"
    )
    .then((response) => {
      projects.value = response.data;
      console.log(projects.value);
    })
    .catch(() => {
      console.log("no projects available");
    });
});

function signOut() {
  currentUser.value.id = "";
  currentUser.value.email = "";
  currentUser.value.password = "";
  isLoggedIn.value = false;
  localStorage.removeItem("currentUser");
  router.replace("/");
  router.go(0);
}
</script>

<template>
  <div
    id="sidebar"
    class="absolute md:w-1/4 lg:w-1/5 md:p-4 md:h-screen bg-white dark:bg-black flex justify-center"
  >
    <div class="mt-10">
      <p class="text-xl hover:font-semibold text-gray-800 dark:text-white">
        {{ currentUser.email }}
      </p>
      <p class="text-xl hover:font-semibold text-gray-800 dark:text-white">
        {{ projects.length }} Projects
      </p>

      <div class="mt-10">
        <p class="text-xl hover:font-semibold text-gray-800 dark:text-white">
          Projects
        </p>
        <div class="mt-5">
          <div
            v-for="project in projects"
            :key="project.id"
            class="flex justify-between"
          >
            <p
              class="text-xl hover:font-semibold text-gray-800 dark:text-white"
            >
              {{ project.title }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <button
      class="absolute left-1/2 -translate-x-1/2 p-2 rounded-xl bottom-10 hover:bg-[var(--color-3)]"
      @click="signOut"
    >
      Sign-out
    </button>
  </div>
  <section id="content" class="absolute md:left-1/4 md:h-screen"></section>
</template>
