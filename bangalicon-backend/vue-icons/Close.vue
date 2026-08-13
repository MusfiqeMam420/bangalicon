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
    <path d="M228 788q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27q-7-21 11-39l560-560q17-17 38-10t28 28q8 20-10 38z m-56-560q-18-18-11-38 7-21 28-28 22-7 39 10l560 560q17 17 10 38t-28 29q-20 7-38-11z"/>
  </svg>
</template>
