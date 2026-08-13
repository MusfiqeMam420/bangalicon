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
    <path d="M320 760q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h280q46 0 82-20a146.4 146.4 0 0 0 57-57Q760 566 760 520t-21-82a138 138 0 0 0-57-57Q646 360 600 360H160V280h440a234.4 234.4 0 0 1 120 32 232 232 0 0 1 88 88q32 55 32 120a234.4 234.4 0 0 1-32 120 242 242 0 0 1-88 88 234.4 234.4 0 0 1-120 32zM132 349Q119 336 119 320t13-29l160-159q17-17 38-10t28 28q8 20-10 38L217 320 348 452q17 17 10 38t-28 29q-20 7-38-11z"/>
  </svg>
</template>
