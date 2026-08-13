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
    <path d="M160 520q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h640q25 0 34 20 10 20 0 40-9 20-34 20z m280-360q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v640q0 25-20 35-20 9-40 0-20-10-20-35z"/>
  </svg>
</template>
