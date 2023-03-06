<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type Project from "@/models/project.model";
import { getProjectById } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/appStore";
import ErrorDisplayer from "@/components/ErrorDisplayer.vue";
import { updateProject, getUserProjects } from "@/utils/utils";
import { useRouter } from "vue-router";
const { currentUser, projects } = storeToRefs(useUserStore());

const route = useRoute();
const router = useRouter();
const currentProject = ref<Project>({
  project_id: "",
  user_id: "",
  title: "",
  description: undefined,
  created_at: "",
  deadline: new Date().toISOString().split("T")[0],
});
const loading = ref(false);
const invalidProjectId = ref(false);
const somethingWentWrong = ref(false);

onMounted(async () => {
  loading.value = true;
  let currentProjectId: string;
  if (typeof route.params.id === "string") {
    currentProjectId = await route.params.id;
  } else {
    currentProjectId = "";
    invalidProjectId.value = true;
  }
  const projectResponse = await getProjectById(
    currentUser.value.user_id,
    currentProjectId
  );
  if (typeof projectResponse !== "number") {
    currentProject.value = await projectResponse;
  } else {
    invalidProjectId.value = true;
  }
  loading.value = false;
});

async function handleUpdateProject() {
  loading.value = true;
  const response = await updateProject(
    currentUser.value.user_id,
    currentProject.value
  );
  if (typeof response === "number") {
    somethingWentWrong.value = true;
    return;
  } else {
    const p = await getUserProjects(currentUser.value.user_id);
    if (typeof p === "number") {
      somethingWentWrong.value = true;
      return;
    } else {
      projects.value = p;
    }
  }
  router.replace("/dashboard");
  loading.value = false;
}
</script>

<template>
  <ErrorDisplayer v-if="invalidProjectId" error="Invalid Project ID" />
  <ErrorDisplayer v-if="somethingWentWrong" error="Something went wrong" />
  <div class="text-6xl font-black">Edit {{ currentProject.title }}</div>
  <form class="mt-10" @submit.prevent="handleUpdateProject()">
    <div class="grid grid-cols-2 gap-5">
      <p>Project Title</p>
      <input class="p-2" type="text" v-model="currentProject.title" />
      <p>Project Description</p>
      <textarea class="p-2" rows="3" v-model="currentProject.description" />
      <p>Project Deadline:</p>
      <input
        id="due date"
        type="date"
        :min="new Date().toISOString().split('T')[0]"
        v-model="new Date(currentProject.deadline).toISOString().split('T')[0]"
        class="p-2"
      />
    </div>
    <div class="flex justify-center mt-5">
      <button class="btn-primary" type="submit">Update</button>
    </div>
  </form>
</template>
