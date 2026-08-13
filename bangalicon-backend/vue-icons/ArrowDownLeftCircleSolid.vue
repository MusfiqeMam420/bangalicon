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
    <path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m148-492q18-18 10-38a42 42 0 0 0-28-28q-21-7-38 10L400 504V400q0-25-20-34a42.400000000000006 42.400000000000006 0 0 0-40 0Q320 375 320 400v199q0 18 11 30 12 11 30 11H560q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20h-104z"/>
  </svg>
</template>
