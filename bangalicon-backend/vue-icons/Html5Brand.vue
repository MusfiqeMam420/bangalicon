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
    <path d="M120 60l65.52 756 294.04 84 294.8-84.08L840 60z m577.52 247.51999999999998H352.52000000000004L360 403.12h330l-25.32 283.84000000000003L480 739.6800000000001 294.96 687.2l-12.68-145.28h90.48l6.4 73.68 100.84 27.599999999999998 100.16-27.959999999999997 10.48-120.28H277.52l-23.599999999999998-280.47999999999996h451.44z"/>
  </svg>
</template>
