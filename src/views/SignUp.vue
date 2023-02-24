<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userDetails";
import { storeToRefs } from "pinia";

const loading = ref(false);
const email = ref("");
const password = ref("");
const { isLoggedIn } = storeToRefs(useUserStore());
const wrongDetails = ref(false);

async function onSubmit() {
  const apiUrl = import.meta.env.VITE_API_URL + "users";
  loading.value = true;
  await axios
    .post(apiUrl, {
      email: email.value,
      password: password.value,
    })
    .then(() => {
      isLoggedIn.value = true;
      console.log(isLoggedIn.value);
    })
    .catch(() => {
      wrongDetails.value = true;
    });
  loading.value = false;
}
</script>

<template>
  <section class="min-h-screen p-6 md:p-8">
    <Spinner v-show="loading" class="float-right" />
    <div class="flex items-center justify-center m-5 md:m-40">
      <form
        @submit.prevent="
          onSubmit();
          if (isLoggedIn) {
            $router.push('/dashboard');
          }
        "
        method="post"
        class="mt-5 flex flex-col items-center justify-center gap-7 outline rounded-3xl p-8 md:p-16"
      >
        <p class="text-2xl">Create Account</p>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          class="outline bg-transparent rounded-lg min-w-[80%] h-12 p-8"
          placeholder="Your email address"
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          class="outline bg-transparent rounded-lg min-w-[80%] h-12 p-8"
          placeholder="A new password"
          required
        />
        <div v-if="wrongDetails" class="dark:text-white text-black">
          An account with this email already exists
        </div>
        <div>
          Already have an account?
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signin"
            >Sign-in</RouterLink
          >
        </div>
        <button
          type="submit"
          class="w-full m-2 p-4 rounded-xl bg-[#B23A48] hover:bg-[#FCB9B2] hover:text-[#8C2F39]"
        >
          Sign Up!
        </button>
      </form>
    </div>
  </section>
</template>
