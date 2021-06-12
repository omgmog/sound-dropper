<template>
    <NavBar></NavBar>

    <div id="main" class="container is-max-desktop">
      <DropList></DropList>
      <DropAdder></DropAdder>
    </div>
</template>

<script>
import DropAdder from './components/DropAdder.vue';
import DropList from './components/DropList.vue';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    DropAdder,
    DropList,
    NavBar,
  },
};
</script>
<style>
  #app,
  #app > div,
  #main {
    height: 100%;
  }
  #main {
    max-height: calc(100% - 52px);
  }
</style>
