<template>
  <div>
    <NavBar></NavBar>

    <div class="container">
      <DropList></DropList>
      <DropAdder></DropAdder>
    </div>
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
