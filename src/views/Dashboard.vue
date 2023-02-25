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
  <div class="dashboard-container">
    <div
      id="sidebar"
      class="absolute md:w-1/4 lg:w-1/5 md:p-4 md:h-screen text-[var(--color-4)] dark:text-[var(--color-2)] bg-[var(--color-2)] dark:bg-[var(--color-4)]"
    >
      <div class="text-2xl">
        Hi
        <div class="inline hover:border-b-4 border-black cursor-pointer">
          {{ currentUser.name }}!
        </div>
      </div>

      <div class="text-xl mt-3">
        <i class="fa-solid fa-house"></i>
        Home:
      </div>
      <div class="mt-3 flex flex-col gap-2">
        <div class="flex flex-row gap-2 w-full">
          <RouterLink
            to="home"
            class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--button-bg-color-1)]"
            >Dashboard</RouterLink
          >
        </div>
        <div class="flex flex-row gap-2 w-full">
          <RouterLink
            to="profile"
            class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--button-bg-color-2)]"
          >
            Profile
          </RouterLink>
        </div>
      </div>
      <div class="text-xl mt-3">
        <i class="fa-solid fa-diagram-project"></i>
        Projects:
      </div>
      <div class="mt-3 flex flex-col gap-2">
        <div
          v-if="projects.length > 0"
          v-for="project in projects"
          :key="project.id"
          class="flex flex-row gap-2 items-center"
        >
          <div class="text-lg">{{ project.title }}</div>
          <div class="text-sm">{{ project.description }}</div>
        </div>
        <div v-else class="text-md">No projects :(</div>
        <RouterLink
          to="create"
          class="m-0 w-full text-left text-lg p-1 px-2 rounded-lg hover:bg-[var(--button-bg-color-2)] hover:text-white"
        >
          Create project!
        </RouterLink>
      </div>
      <button
        class="absolute left-1/2 -translate-x-1/2 py-2 px-10 w-max text-l rounded-xl bottom-10 hover:bg-red-500 hover:text-white"
        @click="signOut"
      >
        Sign-out
      </button>
    </div>

    <section id="content" class="absolute md:left-1/4 md:h-screen">
      <router-view> </router-view>
    </section>
  </div>
</template>
