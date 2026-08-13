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
    <path d="M480 880a392 392 0 0 1-181-44l-116 29q-30 8-53-1a61.6 61.6 0 0 1-33-33q-10-23-2-53l29-117A392 392 0 0 1 80 480q0-109.03999999999999 54-201A398 398 0 0 1 279 134Q371 80 480 80t201 54a388 388 0 0 1 145 145Q880 371 880 480t-54 201a398 398 0 0 1-145 145Q589 880 480 880"/>
  </svg>
</template>
