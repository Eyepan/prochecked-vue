<script setup lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
const { showGraphs, showAffirmations } = storeToRefs(useSettingsStore());
</script>

<template>
  <div class="">
    <div class="text-7xl font-black mb-5">Settings</div>
    <div class="text-2xl font-bold">Edit your settings</div>
    <div class="flex mt-5 items-center justify-between">
      <label for="showgraphs">Show graphs</label>
      <select name="" id="" v-model="showGraphs">
        <option value="true">Show</option>
        <option value="false">Hide</option>
      </select>
    </div>
    <div class="flex mt-5 items-center justify-between">
      <label for="showaffirmations">Show Affirmations</label>
      <select name="" id="" v-model="showAffirmations">
        <option value="true">Show</option>
        <option value="false">Hide</option>
      </select>
    </div>
  </div>
</template>

<style></style>
