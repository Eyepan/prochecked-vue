import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = ref(false);
  const currentUserEmail = ref("");
  const currentUserID = ref("");
  return { isLoggedIn, currentUserEmail, currentUserID };
});
