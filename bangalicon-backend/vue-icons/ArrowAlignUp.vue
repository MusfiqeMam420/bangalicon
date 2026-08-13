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
    <path d="M348 388q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27Q274 350 292 332l159-160q13-13 29-13t29 13l159 160q17 17 10 38t-28 29q-20 7-38-11L480 257zM440 200h80v560q0 25-20 35-20 9-40 0-20-10-20-35z"/>
  </svg>
</template>
