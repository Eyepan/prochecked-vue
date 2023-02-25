<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

const { isLoggedIn, currentUser } = storeToRefs(useUserStore());
const loading = ref(false);
const email = ref("");
const name = ref("");
const password = ref("");

const duplicateMail = ref(false);
const insufficientPassword = ref(false);
const serverError = ref(false);

async function onSubmit() {
  if (password.value.length < 8) {
    insufficientPassword.value = true;
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL + "users";
  loading.value = true;
  await axios
    .post(apiUrl, {
      name: name.value,
      email: email.value,
      password: password.value,
    })
    .then(async () => {
      const apiSignInUrl = import.meta.env.VITE_API_URL + "users/signin";
      await axios
        .post(apiSignInUrl, {
          email: email.value,
          password: password.value,
        })
        .then((response) => {
          isLoggedIn.value = true;
          currentUser.value = response.data;
          console.log("logged in, redirecting");
          router.replace("/dashboard");
        })
        .catch(() => {});
      loading.value = false;
    })
    .catch((error) => {
      if (error.response) {
        if (error.response!.status === 401) {
          duplicateMail.value = true;
        } else {
          console.log(error);
          serverError.value = true;
        }
      }
    });
  loading.value = false;
}
</script>

<template>
  <section>
    <Spinner :style="{ opacity: loading ? '1' : '0' }" class="float-right" />
    <div class="flex items-center justify-center m-5 md:m-40">
      <form
        @submit.prevent="onSubmit()"
        method="post"
        class="mt-5 flex flex-col items-end gap-5 outline rounded-3xl p-8 md:p-16"
      >
        <p class="text-2xl">Create Account</p>
        <input
          type="name"
          name="name"
          id="name"
          v-model="name"
          class="w-full h-12 p-8"
          placeholder="What should we call you?"
          required
        />
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          class="w-full h-12 p-8"
          placeholder="Your email address"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          class="w-full h-12 p-8"
          placeholder="A new password"
          required
        />
        <div v-show="duplicateMail" class="dark:text-white text-black">
          An account with this email already exists.
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signin"
            >Sign-in?</RouterLink
          >
        </div>
        <div v-show="insufficientPassword" class="dark:text-white text-black">
          Password must contain 8 characters or more
        </div>
        <div v-show="serverError" class="dark:text-white text-black">
          Sorry, something went wrong, please try again later
        </div>
        <p class="mt-5" v-show="!duplicateMail">
          Already have an account?
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signin"
            >Sign-in</RouterLink
          >
        </p>
        <button type="submit" class="w-full btn-primary">Sign Up!</button>
      </form>
    </div>
  </section>
</template>
