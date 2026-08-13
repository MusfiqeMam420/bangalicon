<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24,
  },
  color: {
    type: String,
    default: "currentColor",
  },
});
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ color }"
  >
    <path d="M390 254a56 56 0 0 1 40-7q22 4 36 21 14 16 14 39v346q0 22-14 39a58.8 58.8 0 0 1-36 21 56 56 0 0 1-40-7l-300-174a56 56 0 0 1-26-31 61.6 61.6 0 0 1 0-41 56 56 0 0 1 26-32z m360 0a56 56 0 0 1 40-7q22 4 36 21 14 16 14 39v346q0 22-14 39a58.8 58.8 0 0 1-36 21 56 56 0 0 1-40-7l-300-174a56 56 0 0 1-26-31 61.6 61.6 0 0 1 0-41 56 56 0 0 1 26-32z"/>
  </svg>
</template>
