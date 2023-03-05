<script setup lang="ts">
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
const { currentUser } = storeToRefs(useUserStore());
</script>

<template>
  <div class="text-7xl font-black mb-5">Profile</div>

  <p>Your Name: {{ currentUser.name }}</p>
  <p>Your Email: {{ currentUser.email }}</p>
  <p>Your ID: {{ currentUser.user_id }}</p>
</template>
