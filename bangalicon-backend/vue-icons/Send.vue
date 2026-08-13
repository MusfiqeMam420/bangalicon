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
    <path d="M152 448q-24-25-28-56a88 88 0 0 1 14-58q18-26 51-36l510-151a90.8 90.8 0 0 1 65 4q32 13 45 45 14 31 4 65l-151 510q-10 33-36 51a88 88 0 0 1-58 14q-31-4-56-28z m439 326q7 8 1 13-5 4-12 2t-4-12L746 204q3-10 10-8 7 1 8 8 2 7-8 10L183 384q-10 3-12-4-2-8 2-13 5-5 13 2zM332 572l160-160q17-17 38-10 22 7 29 28 7 20-11 38l-160 160z"/>
  </svg>
</template>
