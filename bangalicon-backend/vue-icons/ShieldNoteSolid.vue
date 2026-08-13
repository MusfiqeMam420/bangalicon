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
    <path d="M177 703q-27-22-42-51A140 140 0 0 1 120 588V282q0-46 21-83t58-58T282 120h396q46 0 83 21t58 58T840 282v306q0 34-15 64-15 29-42 51l-211 158a148.8 148.8 0 0 1-92 31q-51 0-92-31zM640 400q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40Q665 320 640 320H320q-25 0-35 20-9 20 0 40 10 20 35 20z m-160 160q25 0 34-20a42.400000000000006 42.400000000000006 0 0 0 0-40q-9-20-34-20H320q-25 0-35 20-9 20 0 40 10 20 35 20z"/>
  </svg>
</template>
