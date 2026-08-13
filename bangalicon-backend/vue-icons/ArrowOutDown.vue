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
    <path d="M840 320q0 18-12 29-12 10-28 10t-28-10Q760 338 760 320V280q0-37-22-58Q717 200 680 200H280q-37 0-59 22Q200 243 200 280v40q0 25-20 35-20 9-40 0Q120 345 120 320V280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80z m-360 423l132-131q18-18 38-11 21 7 28 29 7 21-10 38l-159 160q-13 13-29 13t-29-13l-159-160q-18-18-11-38 7-21 28-28 22-7 39 10zM440 320q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v480h-80z"/>
  </svg>
</template>
