<script setup lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
const { showGraphs, showAffirmations } = storeToRefs(useSettingsStore());
</script>

<template>
  <div>
    <div class="text-7xl font-black mb-5">Settings</div>
    <div class="text-2xl font-bold">Edit your settings</div>
    <div class="flex mt-5 items-center justify-between">
      <label for="showGraphs">Show graphs</label>
      <select name="" id="showGraphs" v-model="showGraphs">
        <option value="true">Show</option>
        <option value="false">Hide</option>
      </select>
    </div>
    <div class="flex mt-5 items-center justify-between">
      <label for="showAffirmations">Show Affirmations</label>
      <select name="" id="showAffirmations" v-model="showAffirmations">
        <option value="true">Show</option>
        <option value="false">Hide</option>
      </select>
    </div>
  </div>
</template>

<style></style>
