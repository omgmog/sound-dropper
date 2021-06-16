<template>
    <div id="main" class="container">
      <DropList></DropList>
      <div class="toolbar flex align-items-center">
        <InputSelect></InputSelect>
        <DropAdder></DropAdder>
        <AppLogin></AppLogin>
      </div>
    </div>
</template>

<script>
import DropAdder from './components/DropAdder.vue';
import DropList from './components/DropList.vue';
import AppLogin from './components/AppLogin.vue';
import InputSelect from './components/InputSelect.vue';

export default {
  name: 'App',
  components: {
    AppLogin,
    DropAdder,
    DropList,
    InputSelect,
  },
  data() {
    return {
      currentPlaying: null,
      isLoggedIn: false,
      drops: [],
    };
  },
  computed: {
    isPlaying() {
      return this.currentPlaying !== null;
    },
  },
};
</script>
