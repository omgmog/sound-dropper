<template id="app-login">
  <Notification ref="successNotification">Name saved</Notification>
  <div class="toolbar-username">
    <div v-if="submitted">
      <div class="">
        <h3 class="no-margin truncate">
          Hello {{ name }}
        </h3>
        <button
            @click.prevent="clearName()"
            class="button-xxs button-pill margin-left-s">
          Not you?
        </button>
      </div>
    </div>
    <div v-else>
      <form
          @submit.prevent="submitted = true"
          class="input-group">
        <input ref="name" type="text" placeholder="Your name"/>
        <button
        class="button"
        @click.prevent="setName()">set name</button>
      </form>
    </div>
  </div>
</template>

<script>
import Notification from './Notification.vue';

export default {
  name: 'AppLogin',
  components: {
    Notification,
  },
  data: () => ({
    submitted: false,
    name: '',
  }),
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.getItem('name');
      this.submitted = !!this.name;
      this.$root.isLoggedIn = !!this.name;
    }
  },
  methods: {
    clearName() {
      this.name = '';
      localStorage.clear('name');
      this.submitted = false;
      this.$root.isLoggedIn = false;
    },
    setName() {
      const getName = this.$refs.name.value;
      this.name = getName;

      localStorage.setItem('name', getName);
      this.submitted = !!this.name;
      this.$root.isLoggedIn = this.submitted;
      this.$refs.successNotification.show();
    },
  },
};
</script>
