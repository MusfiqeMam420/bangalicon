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
    <path d="M80 480q0-91 39-172A404 404 0 0 1 228 171L425 368l-26 9a36 36 0 0 0-22 22l-60 176q-8 22 0 41 8 19.04 27 27t41 0l176-60a48 48 0 0 0 13-9q6-6 9-13l9-26 197 197a404 404 0 0 1-137 109A392 392 0 0 1 480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480m217-352a348 348 0 0 1 86-35A360 360 0 0 1 480 80q108 0 200 54A384 384 0 0 1 826 280Q880 372 880 480q0 50-13 97a348 348 0 0 1-35 86L620 452l23-67q8-22 0-41a48.8 48.8 0 0 0-27-27q-19-8-41 0L508 340zM92 148q-18-18-11-38 7-21 28-28 22-7 39 10l720 720q17 17 10 39-7.039999999999999 21-27 28T812 868z"/>
  </svg>
</template>
