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
    <path d="M280 840a164 164 0 0 1-82-21 156 156 0 0 1-57-57A164 164 0 0 1 120 680V342q0-31 14-60l40-80q20-39 55-60Q265 120 306 120h348q41 0 76 22 36 21 56 59l40 81q14 28.96 14 60V680a164 164 0 0 1-21 82 153.6 153.6 0 0 1-58 57Q725 840 680 840zM735 280l-20-42a88 88 0 0 0-17-22 52 52 0 0 0-19-12 68 68 0 0 0-25-4h-348q-15 0-26 4a64 64 0 0 0-19 12 104 104 0 0 0-16 22L225 280zM480 616l62 62q18 18 38 11 21-8 28-29t-10-38L536 560l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 504l-62-62q-18-18-39-10-20 7-27 28t10 38L424 560l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>
  </svg>
</template>
