<template>
  <div class="drop-list menu">
    <ol class="menu-list">
      <li v-for="(drop, index) in $root.drops" v-bind:key="drop.path" class="box">
        <SoundPlayer v-bind:drop="drop" v-bind:index="index"></SoundPlayer>
      </li>
    </ol>
  </div>
</template>

<script>
import SoundPlayer from './SoundPlayer.vue';

export default {
  name: 'DropList',
  components: {
    SoundPlayer,
  },
  mounted() {
    fetch('/drops')
      .then((res) => res.json())
      .then((drops) => { this.$root.drops = drops; });

    const ws = new WebSocket(document.location.origin.replace(/^http/, 'ws'));

    setInterval(() => ws.send('ping'), 45000);

    ws.addEventListener('message', (e) => {
      try {
        const json = JSON.parse(e.data);
        if (json.type === 'new-file') {
          this.$root.drops.push(json.payload);
        }
      } catch (error) {
        console.error(error);
      }
    });
  },
};
</script>

<style scoped>
  .drop-list {
    height: 100%;
    max-height: calc(100% - 40px);
    overflow: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column-reverse;
  }
</style>
