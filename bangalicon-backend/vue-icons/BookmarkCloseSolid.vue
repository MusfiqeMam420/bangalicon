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
    <path d="M160 240q0-43 21-80A158.8 158.8 0 0 1 240 102 154 154 0 0 1 320 80h320q43 0 80 22 37 21 58 58 22 37 22 80v586q0 17-11 30a46 46 0 0 1-26 17q-16 4-32-2L480 763l-251 108q-16 6-32 2a50.8 50.8 0 0 1-26-17A45.199999999999996 45.199999999999996 0 0 1 160 826z m320 256l62 62q18 18 38 11 21-8 28-29t-10-38L536 440l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 384l-62-62Q400 304 379 312a42 42 0 0 0-27 28q-7 21 10 38L424 440l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>
  </svg>
</template>
