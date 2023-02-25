import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type User from "@/models/user.model";
import type Project from "@/models/project.model";

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref(false);
  const currentUser = ref<User>(
    JSON.parse(localStorage.getItem("currentUser") || "null") || {
      id: "",
      email: "",
      password: "",
    }
  );
  const projects = ref<Project[]>([]);

  if (currentUser.value && currentUser.value.id && currentUser.value.email) {
    isLoggedIn.value = true;
  }

  watch(
    [isLoggedIn, currentUser, projects],
    () => {
      localStorage.setItem("currentUser", JSON.stringify(currentUser.value));
    },
    { deep: true }
  );
  return { isLoggedIn, currentUser, projects };
});
