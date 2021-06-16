<template>
  <!-- eslint-disable max-len -->
  <svg :class="cssClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" :alt="altText">
  <g v-if="icon === 'stop'"><path d="M22,6H8C6.895,6,6,6.895,6,8v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V8C24,6.895,23.105,6,22,6z"></path></g>
  <g v-if="icon === 'play'"><path d="M 6 3 A 1 1 0 0 0 5 4 A 1 1 0 0 0 5 4.0039062 L 5 15 L 5 25.996094 A 1 1 0 0 0 5 26 A 1 1 0 0 0 6 27 A 1 1 0 0 0 6.5800781 26.8125 L 6.5820312 26.814453 L 26.416016 15.908203 A 1 1 0 0 0 27 15 A 1 1 0 0 0 26.388672 14.078125 L 6.5820312 3.1855469 L 6.5800781 3.1855469 A 1 1 0 0 0 6 3 z"></path></g>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcons',
  props: [
    'cssClass',
    'icon',
    'altText',
  ],
};
</script>
