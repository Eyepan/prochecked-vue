<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { currentUser, projects, currentProject } = storeToRefs(useUserStore());
const router = useRouter();
const loading = ref(false);
const title = ref("");
const description = ref("");

async function handleSubmit() {
  loading.value = true;
  axios
    .post(
      import.meta.env.VITE_API_URL +
        "users/" +
        currentUser.value.id +
        "/projects",
      {
        title: title.value,
        description: description.value,
      }
    )
    .then(() => {
      console.log("Project created!");
      axios
        .get(
          import.meta.env.VITE_API_URL +
            "users/" +
            currentUser.value?.id +
            "/projects"
        )
        .then((response) => {
          projects.value = response.data;
          const proj = projects.value.find(
            (project) => project.title === title.value
          );
          if (proj) {
            currentProject.value = proj;
          }
          router.push("/project");
          console.log(projects.value);
        })
        .catch(() => {
          console.log("no projects available");
        });
    })
    .catch((error) => {
      console.log(error);
    });
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
    <button
      class="btn-primary py-2 mx-0 flex items-center justify-evenly"
      type="submit"
    >
      Create my project!
    </button>
  </form>
</template>
