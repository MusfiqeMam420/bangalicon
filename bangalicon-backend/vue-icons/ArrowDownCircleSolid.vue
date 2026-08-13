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
    <path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m40-337V320q0-25-20-34a42.400000000000006 42.400000000000006 0 0 0-40 0q-20 9-20 34v223L368 472q-18-18-39-11-20 7-27 29-7 21 10 38l139 140q12 13 29 13a38 38 0 0 0 29-13l139-140q18-18 11-38-7-21-29-28-21-7-38 10z"/>
  </svg>
</template>
