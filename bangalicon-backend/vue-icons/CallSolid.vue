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
    <path d="M825 880q-72-1-141-16a780 780 0 0 1-132-41 736 736 0 0 1-251-166 768 768 0 0 1-164-248 780 780 0 0 1-41-132 840 840 0 0 1-16-142q0-23 15-39 16-16 39-16h89Q268 80 302 110t40 75l10 72q6 39-12 73-17 34-52 52l-62 30a676 676 0 0 0 132 190 676 676 0 0 0 190 132l30-62q18-35 52-52a114.80000000000001 114.80000000000001 0 0 1 73-12l72 10q45 6 75 40t30 79v89q0 22.959999999999997-16 39-16 15-39 15"/>
  </svg>
</template>
