<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { createNewProject, getUserProjects } from "@/utils/utils";

const { currentUser, projects, currentProject } = storeToRefs(useUserStore());
const router = useRouter();
const loading = ref(false);
const title = ref("");
const description = ref("");
const deadline = ref("");

async function handleSubmit() {
  loading.value = true;
  console.log(deadline);
  const createdString = new Date().toISOString();
  const deadlineString = new Date(deadline.value).toISOString();
  console.log(createdString, deadlineString);
  const response = await createNewProject(
    currentUser.value.user_id,
    title.value,
    description.value,
    createdString,
    deadlineString
  );
  if (typeof response === "number") {
    // TODO: handle error
  } else {
    const p = await getUserProjects(currentUser.value.user_id);
    if (typeof p === "number") {
      // TODO: handle error
    } else {
      projects.value = p;
      currentProject.value = response;
      router.push("/project");
    }
  }
  loading.value = false;
}
</script>

<template>
  <Spinner :style="{ opacity: loading ? '1' : '0' }" class="float-right" />
  <div class="text-3xl">Create a new project!</div>
  <div class="text-l">
    It's always exciting creating a new project. Just give us some details and
    we will do the leg work for you
  </div>

  <form
    method="post"
    @submit.prevent="handleSubmit()"
    class="flex flex-col gap-5 m-10"
  >
    <input
      type="text"
      v-model="title"
      placeholder="Project Title"
      class="block p-2"
      required
    />
    <textarea
      type="text"
      v-model="description"
      placeholder="Project Description (optional)"
      class="p-2 resize-none"
    />
    <div class="text-l">When do you want to finish this project?</div>
    <input type="date" v-model="deadline" class="p-2" />
    <button
      class="btn-primary py-2 mx-0 flex items-center justify-evenly"
      type="submit"
    >
      Create my project!
    </button>
  </form>
</template>
