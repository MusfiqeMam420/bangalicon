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
    <path d="M480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-108 54-200A393.2 393.2 0 0 1 280 134Q372 80 480 80t200 54A384 384 0 0 1 826 280Q880 372 880 480t-54 200A393.2 393.2 0 0 1 680 826Q588 880 480 880m92-252q18 18 38 11 21-8 28-29t-10-38L456 400H560q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40Q585 320 560 320H361q-18 0-30 12Q320 343 320 361V560q0 25 20 35 20 9 40 0 20-10 20-35v-104z"/>
  </svg>
</template>
