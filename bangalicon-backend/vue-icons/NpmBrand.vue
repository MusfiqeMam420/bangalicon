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
    <path d="M426.76 399.56000000000006H480v107.08h-53.239999999999995z"/><path d="M0 292.52v321.36h266.64v53.6H480v-53.6h480V292.52z m266.64 267.92H213.35999999999999V399.76H159.92000000000002v160.68H53.239999999999995V346.12h213.4z m266.6 0h-106.67999999999999v53.6H319.88V346.15999999999997h213.35999999999999z m373.52 0h-53.28V399.76h-53.2v160.68h-53.28V399.76h-53.239999999999995v160.68h-106.67999999999999V346.12h320.03999999999996v214.32z"/>
  </svg>
</template>
