import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const showGraphs = ref("true");
  const showAffirmations = ref("true");
  return { showGraphs, showAffirmations };
});
