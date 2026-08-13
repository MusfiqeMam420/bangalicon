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
    <path d="M408 82q24-4.96 43 6 19 10 25 30 6 19-4 38-16 30-24 60A248 248 0 0 0 440 280q0 68 31 123a222 222 0 0 0 86 86Q612 520 680 520a240 240 0 0 0 68-9 308 308 0 0 0 63-28q18-10 36-9 19 1 29 14 11 12 7 33a396 396 0 0 1-69 182 418 418 0 0 1-145 130Q582 880 480 880q-108 0-200-54A404 404 0 0 1 134 680 388 388 0 0 1 80 480q0-96 43-180A412 412 0 0 1 240 159a404 404 0 0 1 168-77"/>
  </svg>
</template>
