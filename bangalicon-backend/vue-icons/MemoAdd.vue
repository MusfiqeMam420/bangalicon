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
    <path d="M840 548q0 15-5 27a76 76 0 0 1-16 22l-221 222a72 72 0 0 1-23 16A68 68 0 0 1 548 840H280a160 160 0 0 1-80-21A168 168 0 0 1 141 760 160 160 0 0 1 120 680V280q0-43 21-80A158.8 158.8 0 0 1 200 142 154 154 0 0 1 280 120h400q43 0 80 22 37 21 58 58 22 37 22 80zM760 280q0-38-21-59T680 200H280q-37 0-59 21Q200 242 200 280v400q0 37 21 59Q243 760 280 760h263L760 543z m-160 160q25 0 34 20 10 20 0 40-9 20-34 20H360q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20z m-80 160q0 25-20 35-20 9-40 0-20-10-20-35V360q0-25 20-34a42.400000000000006 42.400000000000006 0 0 1 40 0q20 9 20 34z"/>
  </svg>
</template>
