<template id="app-login">
  <div v-if="submitted" class=" is-flex is-justify-content-flex-end is-align-items-center">
    <p>
      Hello {{ name }}
    </p>
    <button
        @click.prevent="submitted = false"
        class="button is-light ml-2 is-small is-outlined tag">
      Not you?
    </button>
  </div>
  <form
      v-else @submit.prevent="submitted = true"
      class="m-0 is-flex is-justify-content-flex-end is-align-items-center">
    <input v-model="name" type="text" placeholder="Your name" class="input"/>
    <button class="button is-dark ml-2">set name</button>
  </form>
</template>

<script>
export default {
  name: 'AppLogin',

  data: () => ({
    submitted: false,
    name: '',
  }),
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.getItem('name');
      this.submitted = !!this.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.setItem('name', newName);
    },
  },
};
</script>
