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
    <path d="M148 748q-17 17-38 10a45.199999999999996 45.199999999999996 0 0 1-29-27q-7-21 11-39l119-120q13-13 29-13t29 13l119 120q17 17 10 38t-28 29q-20 7-38-11L240 657zM332 212q17-17 38-10t28 28q8 20-10 38l-119 120q-13 13-29 13T211 388L92 268q-17-17-10-38a42 42 0 0 1 27-28q21-8 39 10L240 303z"/>
  </svg>
</template>
