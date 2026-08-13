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
    <path d="M800 480H280q-37 0-59 22Q200 523 200 560v160q0 25-20 35-20 9-40 0Q120 745 120 720v-160q0-43 21-80A158.8 158.8 0 0 1 200 422 153.6 153.6 0 0 1 280 400h520z m28-69q13 13 13 29t-13 29l-200 199q-17 17-39 10a42 42 0 0 1-28-27q-7-21 11-39l171-172L572 268q-17-17-10-38 7-22 27-29 21-7 39 11z"/>
  </svg>
</template>
