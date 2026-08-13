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
    <path d="M735 825V600h75v300H120V600h75v225z"/><path d="M279.6 578.96l372.28000000000003 76.6 15.760000000000002-73.72-372.32-76.6z m49.2-174.60000000000002l344.72 158.16 31.48-68-344.68000000000006-159.04z m95.55999999999999-166.88l292.48 239.60000000000002 48.28-57.24-292.52-239.60000000000002zM615 60L552.4 104.64l226.52 300.68L840 360zM270 750h382.52000000000004v-75H270z"/>
  </svg>
</template>
