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
    <path d="M760 200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v560q0 25-20 35-20 9-40 0-20-10-20-35zM348 612q17 17 10 39-7 21-28 28-20 7-38-11l-160-159Q119 496 119 480t13-29l160-159q17-17 38-10 22 7 29 28 7 20-11 38L217 480zM160 520v-80h480q25 0 34 20 10 20 0 40-9 20-34 20z"/>
  </svg>
</template>
