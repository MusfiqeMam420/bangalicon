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
    <path d="M240 800a160 160 0 0 1-80-21A168 168 0 0 1 101 720 160 160 0 0 1 80 640V280q0-43 21-80A158.8 158.8 0 0 1 160 142 154 154 0 0 1 240 120h148q15 0 27 5t23 16L497 200H720q43 0 80 22 37 21 58 58 22 37 22 80v280q0 43-22 80A158.8 158.8 0 0 1 800 779 160 160 0 0 1 720 800z m240-264l62 62q18 18 38 11 21-8 28-29t-10-38L536 480l62-62q17-17 10-38-7-22-28-29-20-7-38 11L480 424l-62-62Q400 344 379 352a42 42 0 0 0-27 28q-7 21 10 38L424 480l-62 62q-18 18-11 39 8 20 29 27t38-10z"/>
  </svg>
</template>
