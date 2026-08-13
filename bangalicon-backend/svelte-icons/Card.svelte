<script>
  /** @type {number | string} */
  export let size = 24;
  /** @type {string} */
  export let color = "currentColor";
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 1000 1000"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style:color={color}
>
  <path d="M120 320h720v80H120z m120 480q-75 0-118-42Q80 715 80 640V320q0-76 42-118Q165 160 240 160h480q75 0 117 42Q880 244 880 320v320q0 75-43 118Q795 800 720 800z m-80-160q0 46 17 63T240 720h480q46 0 63-17T800 640V320q0-46-17-63T720 240H240q-46 0-63 17T160 320z"/>
</svg>
