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
    <path d="M628 732q18 18 11 39-7 20-29 27-21 7-38-10l-281-280q-13-14-13-28 0-15 13-28l281-280q17-17 38-10t28 28q8 20-10 38L377 480z"/>
  </svg>
</template>
