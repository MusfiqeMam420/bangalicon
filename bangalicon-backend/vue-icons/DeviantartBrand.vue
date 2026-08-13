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
    <path d="M765 193.64000000000001V30h-167.44l-16.72 16.48-79 147.12-24.84 16.4h-282v224.72000000000003h155.04l13.799999999999999 16.32-168.84 315.32v163.64000000000001h167.44l16.72-16.48 79-147.16 24.84-16.36h282v-224.76h-155.04l-13.799999999999999-16.4z"/>
  </svg>
</template>
