<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userDetails";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const { isLoggedIn, currentUser } = storeToRefs(useUserStore());
const router = useRouter();

const loading = ref(false);
const email = ref("");
const password = ref("");

const wrongDetails = ref(false);
const serverError = ref(false);

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
      currentUser.value.email = response.data["email"];
      currentUser.value.id = response.data["id"];
      currentUser.value.name = response.data["name"];
      currentUser.value.password = response.data["password"];
      console.log("logged in, redirecting");
      router.replace("/dashboard");
    })
    .catch((error) => {
      if (error.response) {
        if (error.response!.status === 401) {
          wrongDetails.value = true;
        } else {
          console.log(error);
          serverError.value = true;
        }
      }
    });
  isLoggedIn.value = isLoggedIn.value;
  loading.value = false;
}
</script>

<template>
  <section>
    <Spinner :style="{ opacity: loading ? '1' : '0' }" class="float-right" />
    <div class="flex items-center justify-center m-5 md:m-40">
      <form
        @submit.prevent="onSubmit()"
        class="mt-5 flex flex-col items-start gap-5 outline rounded-3xl p-8 md:p-16"
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
        <div
          :style="{ opacity: wrongDetails ? 1 : 0 }"
          class="dark:text-white text-black"
        >
          Incorrect username/password
        </div>
        <div v-show="serverError" class="dark:text-white text-black">
          Sorry, something went wrong, please try again later
        </div>
        <p class="mt-5">
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
  </section>
</template>
