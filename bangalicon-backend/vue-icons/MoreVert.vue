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
    <path d="M320 480a80 80 0 0 1-23 57Q274 560 240 560a80 80 0 0 1-57-23A80 80 0 0 1 160 480q0-34 23-57A80 80 0 0 1 240 400q34 0 57 23T320 480m0-280a80 80 0 0 1-23 57Q274 280 240 280a80 80 0 0 1-57-23A80 80 0 0 1 160 200q0-34 23-57A80 80 0 0 1 240 120q34 0 57 23Q320 165.96 320 200m0 560a80 80 0 0 1-23 57Q274 840 240 840a80 80 0 0 1-57-23A80 80 0 0 1 160 760q0-34 23-57A80 80 0 0 1 240 680q34 0 57 23Q320 725.96 320 760"/>
  </svg>
</template>
