<script setup lang="ts">
import LoadingProgressIndicator from "@/components/LoadingProgressIndicator.vue";
import { ref } from "vue";
import { vAutoAnimate } from "@formkit/auto-animate";
import { useUserStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { signin } from "@/utils/utils";
const { isLoggedIn, currentUser } = storeToRefs(useUserStore());
const router = useRouter();

const loading = ref(false);
const email = ref("");
const password = ref("");

const wrongDetails = ref(false);
const serverError = ref(false);

async function onSubmit() {
  loading.value = true;
  const response = await signin(email.value, password.value);
  if (typeof response !== "number") {
    isLoggedIn.value = true;
    currentUser.value = response;
    router.replace("/dashboard");
  } else {
    if (response === 404) {
      wrongDetails.value = true;
      // you messed up
    } else {
      serverError.value = true;
      // i messed up
    }
  }
  if (currentUser.value.user_id === "") {
    serverError.value = true;
    isLoggedIn.value = false;
  }
  loading.value = false;
}
</script>

<template>
  <div class="flex items-center justify-center p-5 md:p-40 h-screen">
    <LoadingProgressIndicator
      v-auto-animate
      v-if="loading"
      class="float-right"
    />
    <div class="">
      <form
        v-auto-animate
        @submit.prevent="onSubmit()"
        class="text-center flex flex-col items-start gap-5 outline rounded-3xl p-8 md:p-16"
      >
        <p class="text-2xl">Welcome back</p>
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
          placeholder="Your password"
          required
        />

        <Transition>
          <div v-if="wrongDetails" class="text-red-500">
            Incorrect username/password
          </div>
        </Transition>
        <Transition>
          <div v-if="serverError" class="text-red-500">
            Sorry, something went wrong, please try again later
          </div>
        </Transition>

        <p class="mt-5 text-sm md:text-lg">
          Don't have an account?
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signup"
            >Sign-Up</RouterLink
          >
        </p>
        <button class="w-full btn-primary">Log In</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
