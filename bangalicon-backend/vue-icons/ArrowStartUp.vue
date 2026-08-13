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
    <path d="M760 760q25 0 34 20 10 20 0 40-9 20-34 20H200q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20zM348 348q-17 17-39 10a42 42 0 0 1-28-27Q274 310 292 292l159-160q13-13 29-13t29 13l159 160q17 16.96 10 39-7 21-28 28-20 7-38-11L480 217zM440 160h80v480q0 25-20 35-20 9-40 0-20-10-20-35z"/>
  </svg>
</template>
