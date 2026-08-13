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
    <path d="M152 448q-24-25-28-56a88 88 0 0 1 14-58q18-26 51-36l510-151a90.8 90.8 0 0 1 65 4q32 13 45 45 14 31 4 65l-151 510q-10 33-36 51a88 88 0 0 1-58 14q-31-4-56-28zM303 600L360 657l188-189q17-17 10-38-7-22-28-29-20-7-38 11z"/>
  </svg>
</template>
