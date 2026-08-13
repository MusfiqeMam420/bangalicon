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
    <path d="M80 560q0-61 29-113a245.6 245.6 0 0 1 77-86A280 280 0 0 1 239 248 276 276 0 0 1 336 169Q394 140 460 140q69 0 128 31 59 30 98 84a258.4 258.4 0 0 1 50 118A218 218 0 0 1 840 454q40 56 40 126 0 59-30 110a216 216 0 0 1-80 81A216 216 0 0 1 660 800H320a240 240 0 0 1-121-32A236 236 0 0 1 112 681 240 240 0 0 1 80 560"/>
  </svg>
</template>
