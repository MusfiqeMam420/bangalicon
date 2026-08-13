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
    <path d="M148 388q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27Q74 350 92 332l119-120Q224 199 240 199t29 13l119 120q17 17 10 38t-28 29q-20 7-38-11L240 297z m184 184q17-17 38-10t28 28q8 20-10 38l-119 120q-13 13-29 13t-29-13l-119-120q-17-17-10-38 7.039999999999999-21 27-28 21-8 39 10L240 663z"/>
  </svg>
</template>
