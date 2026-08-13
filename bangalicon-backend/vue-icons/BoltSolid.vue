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
    <path d="M476 118q20-24 49-23 29 0 49 21 21 21 17 52l-26 232h148q26 0 43 17 17 16 18 40t-16 44l-316 349q-21 23-49 22a69.6 69.6 0 0 1-47-22q-19-21-16-52L355 600H204q-26 0-43-16a65.19999999999999 65.19999999999999 0 0 1-18-40q-2-24 14-44z"/>
  </svg>
</template>
