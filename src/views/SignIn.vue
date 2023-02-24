<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userDetails";
import { storeToRefs } from "pinia";

const loading = ref(false);
const email = ref("");
const password = ref("");
const { isLoggedIn, currentUserEmail, currentUserID } = storeToRefs(
  useUserStore()
);
const wrongDetails = ref(false);
async function onSubmit() {
  const apiUrl = import.meta.env.VITE_API_URL + "users/signin";
  loading.value = true;
  await axios
    .post(apiUrl, {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      isLoggedIn.value = true;
      wrongDetails.value = false;
      console.log(response);
      currentUserEmail.value = response.data["email"];
      currentUserID.value = response.data["id"];
      console.log(currentUserID.value, currentUserEmail.value);
      console.log("logged in, redirecting");
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
            $router.replace(currentUserID + '/dashboard');
          }
        "
        class="mt-5 flex flex-col items-center justify-center gap-7 outline rounded-3xl p-8 md:p-16"
      >
        <p class="text-2xl">Welcome back</p>
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
          placeholder="Your password"
          required
        />
        <div v-if="wrongDetails" class="dark:text-white text-black">
          Incorrect username/password
        </div>
        <div>
          Don't have an account?
          <RouterLink
            class="rounded-xl p-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
            to="/signup"
            >Sign-Up</RouterLink
          >
        </div>
        <button
          class="w-full m-2 p-4 rounded-xl bg-[#B23A48] hover:bg-[#FCB9B2] hover:text-[#8C2F39]"
        >
          Log In
        </button>
      </form>
    </div>
  </section>
</template>
