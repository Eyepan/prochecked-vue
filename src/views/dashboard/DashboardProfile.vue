<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { updateUser } from "@/utils/utils";
import LoadingProgressIndicator from "@/components/LoadingProgressIndicator.vue";
import ErrorDisplayer from "@/components/ErrorDisplayer.vue";
const { currentUser } = storeToRefs(useUserStore());
const currentPassword = ref("");
const newPassword = ref("");
const newPasswordConfirmation = ref("");
const loading = ref(false);
const somethingWentWrong = ref(false);
const passwordsDontMatch = ref(false);
const insufficientPassword = ref(false);
async function onSubmit() {
  loading.value = true;
  somethingWentWrong.value = false;
  if (newPassword.value !== newPasswordConfirmation.value) {
    loading.value = false;
    passwordsDontMatch.value = true;
    return;
  }
  if (newPassword.value.length < 8) {
    loading.value = false;
    insufficientPassword.value = true;
    return;
  }
  const response = await updateUser(
    currentUser.value.user_id,
    currentUser.value.name,
    currentUser.value.email,
    currentPassword.value,
    newPassword.value
  );
  if (typeof response === "number") {
    somethingWentWrong.value = true;
  } else {
    currentUser.value = response;
    currentPassword.value = newPassword.value;
    newPassword.value = "";
  }
  loading.value = false;
}
</script>

<template>
  <ErrorDisplayer
    v-auto-animate
    v-if="somethingWentWrong"
    error="Something went wrong"
  />
  <LoadingProgressIndicator v-if="loading" />
  <div class="text-7xl font-black mb-5">Profile</div>
  <div class="text-2xl font-bold mb-5">Edit your profile</div>
  <p class="text-sm">Your ID: {{ currentUser.user_id }}</p>
  <form @submit.prevent="onSubmit()">
    <div class="grid grid-cols-2 gap-5 mt-10">
      <div>Your Name:</div>
      <input class="p-2" type="text" v-model="currentUser.name" />
      <p>Your Email:</p>
      <input class="p-2" type="text" v-model="currentUser.email" />
      <p>Your Password:</p>
      <input class="p-2 w-full" type="password" v-model="currentPassword" />
      <p>New Password:</p>
      <input class="p-2" type="password" v-model="newPassword" />
      <p>Confirm Password:</p>
      <input class="p-2" type="password" v-model="newPasswordConfirmation" />
      <div
        v-if="passwordsDontMatch"
        class="col-span-2 text-center text-red-500"
      >
        Passwords don't match
      </div>
      <div
        v-if="insufficientPassword"
        class="col-span-2 text-center text-red-500"
      >
        Password must be at least 8 characters long
      </div>
    </div>
    <div class="flex items-center justify-center mt-10">
      <button type="submit" class="btn-primary px-10">Save</button>
    </div>
  </form>
</template>
