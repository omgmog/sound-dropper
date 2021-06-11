<template>
  <div class="notification is-success" v-if="!hidden">
    <button class="delete" @click="hide"></button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Notification',

  data: () => ({
    hidden: true,
  }),

  methods: {
    show() {
      this.hidden = false;
      setTimeout(this.hide, 2000);
    },
    hide() { this.hidden = true; },
  },
};
</script>
