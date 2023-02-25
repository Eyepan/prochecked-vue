<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate";
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
const { currentUser, projects, isLoggedIn, currentProject } = storeToRefs(
  useUserStore()
);

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

      <div class="text-xl mt-3">Home:</div>
      <div class="mt-3 flex flex-col gap-2 my-3">
        <RouterLink
          to="home"
          class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--button-bg-color-1)] hover:text-[var(--color-5)]"
        >
          <i class="fa-solid fa-chart-simple"></i>
          Dashboard</RouterLink
        >
        <RouterLink
          to="profile"
          class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--button-bg-color-2)] hover:text-[var(--color-5)]"
        >
          <i class="fa-solid fa-person"></i>
          Profile
        </RouterLink>
        <RouterLink
          to="/settings"
          class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--color-1)] hover:text-[var(--color-5)]"
        >
          <i class="fa-solid fa-gear"></i>
          Settings
        </RouterLink>
      </div>
      <div class="w-full h-1 bg-black rounded-3xl"></div>
      <div class="text-xl my-3">
        <i class="fa-solid fa-diagram-project"></i>
        Projects:
      </div>
      <div class="mt-3 flex flex-col gap-2">
        <ol
          v-auto-animate
          v-for="project in projects"
          :key="project.id"
          class="flex flex-row gap-2 items-center"
        >
          <RouterLink
            to="/project"
            class="text-lg hover:font-bold cursor-pointer"
          >
            <span @click="currentProject = project">{{ project.title }}</span>
          </RouterLink>
        </ol>
        <div v-if="projects.length == 0" class="text-md">No projects :(</div>
        <div class="w-full h-1 bg-black rounded-3xl"></div>
        <RouterLink
          to="create"
          class="m-0 w-full text-left text-lg p-1 px-2 rounded-lg hover:bg-[var(--button-bg-color-2)] hover:text-white"
        >
          Create a new project!
        </RouterLink>
      </div>
      <button
        class="absolute left-1/2 -translate-x-1/2 bottom-10 py-2 px-10 w-max text-l rounded-xl hover:bg-red-500 hover:text-white"
        @click="signOut"
      >
        Sign-out
      </button>
    </div>

    <section
      id="content"
      class="absolute md:left-1/4 lg:left-1/5 md:h-screen w-3/4"
    >
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 150ms ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
