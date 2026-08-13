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
    <path d="M900 496.88H435v335.6L900 900z m-495 0H60v281.24l345 50.08zM900 60L435 126.4v340.48H900zM405 130.68L60 180v286.88h345z"/>
  </svg>
</template>
