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
    <path d="M320 600q0 17-12 28a45.599999999999994 45.599999999999994 0 0 1-29 12 35.2 35.2 0 0 1-27-12l-120-120A36 36 0 0 1 120 480q0-17 12-28l120-120q12-12 28-11 16 0 28 11T320 360z"/>
  </svg>
</template>
