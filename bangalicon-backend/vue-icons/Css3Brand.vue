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
    <path d="M120 60l65.6 756 294 84 294.8-84.08L840 60z m545.04 627.9200000000001l-184.92000000000002 52.72-184.60000000000002-52.96-12.64-145.8h90.48l6.4 74.16 100.52 28.4 0.24 0.56 100.24-27.839999999999996 10.56-120.28H380.64l-7.52-93.75999999999999h226.23999999999998l8.16-95.60000000000001H262.52L255 215.6h451.08z"/>
  </svg>
</template>
