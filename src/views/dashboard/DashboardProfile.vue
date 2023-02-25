<script setup lang="ts">
import { useUserStore } from "@/stores/userDetails";
import { storeToRefs } from "pinia";
const { currentUser } = storeToRefs(useUserStore());
</script>

<template>
  <p>Your Name: {{ currentUser.name }}</p>
  <p>Your Email: {{ currentUser.email }}</p>
  <p>Your ID: {{ currentUser.id }}</p>
</template>
