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
    <path d="M320 520q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h320q25 0 34 20 10 20 0 40-9 20-34 20zM240 280q-25 0-35-20a46.8 46.8 0 0 1 0-40Q215 200 240 200h480q25 0 34 20 10 20 0 40-9 20-34 20zM160 760q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h640q25 0 34 20 10 20 0 40-9 20-34 20z"/>
  </svg>
</template>
