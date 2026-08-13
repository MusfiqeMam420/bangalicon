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
    <path d="M226 695A368 368 0 0 1 148 580 356 356 0 0 1 120 440q0-98 48-181A364 364 0 0 1 299 128 356 356 0 0 1 480 80q98 0 181 48A352 352 0 0 1 792 259 356 356 0 0 1 840 440q0 74-28 140a356 356 0 0 1-78 114l-138 140q-32 32-74 44a160 160 0 0 1-83 0 169.60000000000002 169.60000000000002 0 0 1-73-44zM480 496l62 62q18 18 38 11 21-8 28-29t-10-38L536 440l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 384l-62-62Q400 304 379 312a42 42 0 0 0-27 28q-7 21 10 38L424 440l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>
  </svg>
</template>
