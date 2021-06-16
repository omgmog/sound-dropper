<template>
  <div
  class="notification border text-align-center"
  :class="[
    getHidden,
    `border-color-${getMsgType} background-${getMsgType}-50`
  ]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: ['msgType'],
  data: () => ({
    hidden: true,
  }),
  computed: {
    getHidden() {
      return this.hidden ? 'hidden' : 'visible';
    },
    getMsgType() {
      return this.msgType ? this.msgType : 'success';
    },
  },
  methods: {
    show() {
      this.hidden = false;
      setTimeout(this.hide, 2000);
    },
    hide() { this.hidden = true; },
  },
};
</script>
