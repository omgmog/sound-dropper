<template>
  <nav class="navbar is-black" role="navigation" aria-label="main navigation">
      <div class="container">
          <div class="navbar-start">
            <AppLogin></AppLogin>
          </div>
          <h1 class="navbar-brand is-size-3">{{title}}</h1>
          <div class="navbar-end"><InputSelect></InputSelect></div>
      </div>
  </nav>
</template>

<script>
import AppLogin from './AppLogin.vue';
import InputSelect from './InputSelect.vue';

export default {
  name: 'NavBar',
  components: {
    AppLogin,
    InputSelect,
  },
  data: () => ({
    title: 'Dropper',
  }),
};
</script>
