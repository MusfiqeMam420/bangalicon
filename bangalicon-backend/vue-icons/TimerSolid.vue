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
    <path d="M480 880q-98 0-181-48A352 352 0 0 1 168 701 356 356 0 0 1 120 520q0-98 48-181A352 352 0 0 1 299 208 356 356 0 0 1 480 160q98 0 181 48A352 352 0 0 1 792 339 356 356 0 0 1 840 520a356 356 0 0 1-48 181 352 352 0 0 1-131 131A356 356 0 0 1 480 880m120-840q25 0 34 20 10 20 0 40-9 20-34 20H360q-25 0-35-20a46.8 46.8 0 0 1 0-40Q335 40 360 40z m-80 320q0-25-20-34a42.400000000000006 42.400000000000006 0 0 0-40 0q-20 9-20 34v160q0 25 20 35 20 9 40 0 20-10 20-35z"/>
  </svg>
</template>
