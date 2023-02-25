<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userDetails";
import axios from "axios";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
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
}
</script>

<template>
  <section>
    <button class="float-right" @click="signOut">Sign-out</button>
    Hi {{ currentUser.email }}

    <div v-if="projects.length > 0" v-for="project in projects">
      {{ project.title }}
    </div>
    <div v-else>You haven't created a project yet, create one now!</div>
  </section>
</template>
