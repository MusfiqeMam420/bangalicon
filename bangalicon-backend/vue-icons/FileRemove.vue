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
    <path d="M320 880a160 160 0 0 1-80-21A168 168 0 0 1 181 800 160 160 0 0 1 160 720V240q0-43 21-80A158.8 158.8 0 0 1 240 102 154 154 0 0 1 320 80h203q7 0 12 3 6 2 11 6l245 245a36 36 0 0 1 6 11q3 5 3 12V720q0 43-22 80A158.8 158.8 0 0 1 720 859 160 160 0 0 1 640 880z m320-80q37 0 58-21 22-22 22-59v-320h-199q-18 0-30-11-11-12-11-30V160H320q-37 0-59 22Q240 203 240 240v480q0 37 21 59Q283 800 320 800z m23-480L560 217V320zM360 600q-25 0-35-20a46.8 46.8 0 0 1 0-40q10-20 35-20h240q25 0 34 20 10 20 0 40-9 20-34 20z"/>
  </svg>
</template>
