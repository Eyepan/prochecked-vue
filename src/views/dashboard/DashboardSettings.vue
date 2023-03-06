<script setup lang="ts">
import { useSettingsStore } from "@/stores/settingsStore";
import { storeToRefs } from "pinia";
const { showGraphs, defaultFontSize } = storeToRefs(useSettingsStore());
</script>

<template>
  <div>
    <div class="text-7xl font-black mb-5">Settings</div>
    <div class="text-2xl font-bold">Edit your settings</div>
    <!-- show graphs -->
    <div class="flex mt-5 items-center justify-between">
      <label for="showgraphs">Show graphs</label>
      <select name="" id="" v-model="showGraphs">
        <option value="true">Show</option>
        <option value="false">Hide</option>
      </select>
    </div>
    <!-- default font size -->
    <div class="flex mt-5 items-center justify-between">
      <label for="defaultfontsize">Default font size</label>
      <input type="text" v-model="defaultFontSize" class="p-2" />
    </div>
  </div>
</template>
