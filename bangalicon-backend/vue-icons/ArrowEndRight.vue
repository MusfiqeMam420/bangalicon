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
    <path d="M760 200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v560q0 25-20 35-20 9-40 0-20-10-20-35z m-177 280L452 348q-18-18-11-38 7-21 28-28 22-7 39 10l160 159q13 13 13 29t-13 29l-160 159q-18 18-39 11a42 42 0 0 1-27-28q-7-22 10-39zM160 520q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h480v80z"/>
  </svg>
</template>
