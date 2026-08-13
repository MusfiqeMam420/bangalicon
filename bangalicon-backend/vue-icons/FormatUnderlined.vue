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
    <path d="M480 640a196 196 0 0 1-101-27 208 208 0 0 1-72-72A196 196 0 0 1 280 440V200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v240q0 36 15 63t42 42T480 560t63-15 42-42T600 440V200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34v240q0 55-27 101a196 196 0 0 1-72 72A196 196 0 0 1 480 640m-280 160q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h560q25 0 34 20 10 20 0 40-9 20-34 20z"/>
  </svg>
</template>
