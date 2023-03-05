<template>
  <div class="fixed top-0 w-full h-1 bg-gray-300">
    <div class="h-full animate-shimmer" style="width: 100%"></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 1s infinite;
  background-size: 2000px 200px;
  background-image: linear-gradient(45deg, #ffffff, black);
}
</style>
