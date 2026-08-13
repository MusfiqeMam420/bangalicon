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
    <path d="M361 817q-112-74-197-188Q80 514 80 360a234.4 234.4 0 0 1 32-120A242 242 0 0 1 200 152 234.4 234.4 0 0 1 320 120q55 0 103 23 48 22 81 62 6 6-9 9-15 2-30 0-14-3-9-9a236 236 0 0 1 81-62A236 236 0 0 1 640 120a234.4 234.4 0 0 1 120 32A232 232 0 0 1 848 240q32 55 32 120 0 154-85 269-84 114-196 188l-17 11q-50 33-102 33-51 0-101-33z"/>
  </svg>
</template>
