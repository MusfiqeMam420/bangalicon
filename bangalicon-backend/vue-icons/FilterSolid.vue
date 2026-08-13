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
    <path d="M428 840q-20 0-34-14a46.4 46.4 0 0 1-14-34v-329q0-4 6 11 7 15 4 12l-200-200q-32-31-32-70a96 96 0 0 1 29-68q28-28 72-28h442q44 0 72 28t28 68q1 39-31 70l-200 200q-2 2 3-8 5-10.96 7-15V792q0 20-14 34t-34 14z"/>
  </svg>
</template>
