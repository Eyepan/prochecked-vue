<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { getUserProjects } from "@/utils/utils";
const { currentUser, projects, isLoggedIn } = storeToRefs(useUserStore());

const router = useRouter();

const showSideBar = ref(false);
onMounted(async () => {
  const response = await getUserProjects(currentUser.value.user_id);
  if (typeof response === "number") {
    // TODO: handle wrong stuff
  } else {
    projects.value = response;
  }
});

function signOut() {
  currentUser.value.user_id = "";
  currentUser.value.email = "";
  currentUser.value.password = "";
  isLoggedIn.value = false;
  localStorage.removeItem("currentUser");
  router.replace("/");
}
</script>

<template>
  <div v-auto-animate class="flex flex-col transition-all h-screen">
    <div class="w-full flex-flex-row">
      <i
        class="z-30 m-5 p-2 fa-solid fa-bars fa-xl cursor-pointer"
        @click="showSideBar = true"
      ></i>
      Pro-Checked
    </div>
    <!-- hamburger sidebar -->
    <div
      id="sidebar"
      v-if="showSideBar"
      class="z-50 rounded-r-2xl absolute md:w-1/4 lg:w-1/6 p-4 h-full text-[var(--color-1)] dark:text-[var(--color-5)] bg-[var(--color-4)] dark:bg-[var(--color-2)]"
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
      <div class="mt-3 flex flex-col gap-2 my-3">
        <RouterLink
          to="/dashboard"
          class="w-full text-left text-lg p-1 px-2 rounded-md hover:bg-[var(--button-bg-color-1)] hover:text-[var(--color-5)]"
        >
          <i class="fa-solid fa-chart-simple"></i>
          Dashboard</RouterLink
        >
        <RouterLink
          to="/profile"
          class="w-full text-left text-lg px-2 p-1 rounded-md hover:bg-[var(--button-bg-color-2)] hover:text-[var(--color-5)]"
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
          :key="project.project_id"
          class="flex flex-row gap-2 items-center"
        >
          <RouterLink
            :to="`/project/${project.project_id}`"
            class="text-lg cursor-pointer w-full py-1 pl-2 rounded-lg hover:bg-[var(--color-5)] dark:hover:bg-[var(--color-1)]"
          >
            {{ project.title }}
          </RouterLink>
        </ol>
        <div v-if="projects.length == 0" class="text-md">No projects :(</div>
        <div class="w-full h-1 bg-black rounded-3xl"></div>
        <RouterLink
          to="/create"
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
      @click="showSideBar = false"
      :class="showSideBar ? 'opacity-50' : 'opacity-100'"
      class="h-full w-full p-10 overflow-y-scroll"
    >
      <router-view />
    </section>
  </div>
</template>
