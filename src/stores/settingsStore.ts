import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const showGraphs = ref("true");
  return { showGraphs };
});
