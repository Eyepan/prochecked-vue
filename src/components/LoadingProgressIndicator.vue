<template>
  <div
    class="shimmer-animation absolute bg-black w-full dark:bg-white h-1"
  ></div>
</template>

<style scoped>
.shimmer-animation {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
