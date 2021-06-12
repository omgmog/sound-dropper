<template>
  <nav class="navbar is-black" role="navigation" aria-label="main navigation">
      <div class="container is-max-desktop">
          <div class="navbar-start">
            <AppLogin></AppLogin>
          </div>
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
};
</script>
