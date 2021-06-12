<template>
  <nav class="navbar is-black" role="navigation" aria-label="main navigation">
      <div class="container is-max-desktop">
        <div class="navbar-menu is-active">
          <div class="navbar-start">
            <InputSelect></InputSelect>
          </div>
          <div class="navbar-end">
            <AppLogin></AppLogin>
          </div>
        </div>
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
