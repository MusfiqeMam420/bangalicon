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
    <path d="M160 360q0-17 12-28t28-11a33.6 33.6 0 0 1 28 11l120 120q12 11 12 28t-12 28l-120 120q-12 12-28 12a44 44 0 0 1-28-12 36 36 0 0 1-12-28z"/>
  </svg>
</template>
