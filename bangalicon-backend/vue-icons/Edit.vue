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
    <path d="M147 874a46 46 0 0 1-34-3 52 52 0 0 1-24-24 46 46 0 0 1-3-34l38-154L634 150q24-24 55-32a109.2 109.2 0 0 1 62 0q31 8 55 32l4 4q24 24 32 55 9 31 0 62a118.80000000000001 118.80000000000001 0 0 1-32 55L301 836z m16-40a20 20 0 0 0 0-9q0-6-2-15a120 120 0 0 0-6-20l104-26L754 270q16-16 16-30t-16-30l-4-4q-16-16-30-16t-30 16L196 701zM572 268l56-56 120 120-56 56z"/>
  </svg>
</template>
