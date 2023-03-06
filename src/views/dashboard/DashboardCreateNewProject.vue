<script setup lang="ts">
import LoadingProgressIndicator from "@/components/LoadingProgressIndicator.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { createNewProject, getUserProjects } from "@/utils/utils";

const { currentUser, projects } = storeToRefs(useUserStore());
const router = useRouter();
const loading = ref(false);
const title = ref("");
const description = ref("");
const deadline = ref(new Date().toISOString().split("T")[0]);

// no comments for you future pan
// it was hard to write
// it will be harder to read
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
    // TODO: handle this error because fuck you future pan
  } else {
    const p = await getUserProjects(currentUser.value.user_id);
    if (typeof p === "number") {
      // FIXME: No error handling because of COURSE it will work, right?
    } else {
      projects.value = p;
      router.push("/project/" + response.project_id + "");
    }
  }
  loading.value = false;
}
</script>

<template>
  <LoadingProgressIndicator
    :style="{ opacity: loading ? '1' : '0' }"
    class="float-right"
  />
  <div class="text-5xl font-black mb-5">Create a new project!</div>
  <div class="text-l">
    It's always exciting creating a new project. Just give us some details and
    we will do the leg work for you.
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
    <input
      type="date"
      :min="new Date().toISOString().split('T')[0]"
      v-model="deadline"
      class="p-2"
    />
    <button
      class="btn-primary py-2 mx-0 flex items-center justify-evenly"
      type="submit"
    >
      Create my project!
    </button>
  </form>
</template>
