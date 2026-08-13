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
    <path d="M200 760q0 25-20 35-20 9-40 0Q120 785 120 760V200q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34z m308-148q17 17 10 39-7 21-28 28-20 7-38-11l-160-159Q279 496 279 480t13-29l160-159q17-17 38-10 22 7 29 28 7 20-11 38L377 480zM320 520v-80h480q25 0 34 20 10 20 0 40-9 20-34 20z"/>
  </svg>
</template>
