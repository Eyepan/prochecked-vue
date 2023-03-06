<script setup lang="ts">
import LoadingProgressIndicator from "@/components/LoadingProgressIndicator.vue";
import { ref } from "vue";
import { vAutoAnimate } from "@formkit/auto-animate";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { signup } from "@/utils/utils";
import { useUserStore } from "@/stores/appStore";

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
  serverError.value = false;
  duplicateMail.value = false;
  if (password.value.length < 8) {
    insufficientPassword.value = true;
    return;
  }
  insufficientPassword.value = false;
  loading.value = true;
  const response = await signup(name.value, email.value, password.value);
  if (typeof response === "number") {
    if (response === 409) {
      duplicateMail.value = true;
    } else {
      serverError.value = true;
    }
  } else {
    isLoggedIn.value = true;
    currentUser.value = response;
    router.replace("/dashboard");
  }
  loading.value = false;
}
</script>

<template>
  <section>
    <LoadingProgressIndicator
      :style="{ opacity: loading ? '1' : '0' }"
      class="float-right"
    />
    <div class="flex items-center justify-center m-5 md:m-40">
      <form
        v-auto-animate
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
        <div v-if="duplicateMail" class="dark:text-white text-black">
          An account with this email already exists.
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signin"
            >Sign-in?</RouterLink
          >
        </div>
        <div v-if="insufficientPassword" class="dark:text-white text-black">
          Password must contain 8 characters or more
        </div>
        <div v-if="serverError" class="dark:text-white text-black">
          Sorry. Something went wrong on our side, please try again later
        </div>
        <p class="mt-5" v-if="!serverError">
          Already have an account?
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signin"
            >Sign-in</RouterLink
          >
        </p>
        <button v-if="!serverError" type="submit" class="w-full btn-primary">
          Sign Up!
        </button>
      </form>
    </div>
  </section>
</template>
