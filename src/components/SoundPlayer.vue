 <template>
  <div>
    <div class="is-flex is-flex-direction-row">
      <span class="is-flex-grow-1">
        <strong>{{ drop.name }}</strong> {{dropDate}} at {{dropTime}} ({{dropTimecode}})
        <br>ID:{{ $root.drops[index].id }}
      </span>
      <button
      v-on:click="play"
      v-if="!$root.isPlaying || ($root.currentPlaying != index)"
      class="button is-primary is-align-self-flex-end">
        Play
      </button>
      <button
      v-on:click="stop"
      v-if="$root.isPlaying && ($root.currentPlaying == index)"
      class="button is-danger is-align-self-flex-end">
        Stop
      </button>
    </div>
    <div class="progress-track has-background-grey-lighter mt-4">
      <div class="progress-bar has-background-primary"
      v-bind:style="{width:progress+'%'}"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-track {
  width: 100%;
  height: 4px;
}
.progress-bar {
  height: 100%;
  width: 0;
}
</style>

<script>
import { Howl } from 'howler';

const leftPad = (val) => `0${val}`.substr(-2);

// clearInterval wrapper so we can debug easily
const clearTheInterval = (which) => {
  clearInterval(which);
  // console.log(`Cleared ${which}`);
};

export default {
  name: 'SoundPlayer',
  props: ['drop', 'index'],
  data: () => ({
    duration: 0,
    date: null,
    player: null,
    interval: null,
    progress: 0,
  }),

  mounted() {
    const vm = this;
    const root = vm.$root;

    root.drops[vm.index].player = new Howl({
      src: [`/drops/${vm.drop.path}`],
    });

    root.drops[vm.index].player.on('load', () => {
      vm.duration = root.drops[vm.index].player.duration();
      // update the player id for the drop in the root drops list based on Howler's player
      const soundId = root.drops[vm.index].player._sounds[0]._id;
      root.drops[vm.index].id = soundId;
    });
    root.drops[vm.index].player.on('play', () => {
      root.isPlaying = true;
      root.currentPlaying = vm.index;

      const intervalStep = root.drops[vm.index].player.duration();
      vm.interval = setInterval(() => {
        vm.updateProgress();
      }, intervalStep);
    });
    root.drops[vm.index].player.on('stop', () => {
      root.isPlaying = false;
      root.currentPlaying = null;
      clearTheInterval(vm.interval);
    });
    root.drops[vm.index].player.on('end', () => {
      root.isPlaying = false;
      root.currentPlaying = vm.index + 1;

      if (root.currentPlaying < root.drops.length) {
        root.drops[root.currentPlaying].player.play();
      } else {
        root.currentPlaying = null;
        if (root.drops[root.currentPlaying]) {
          root.drops[root.currentPlaying].player.stop();
        }
      }
      clearTheInterval(vm.interval);
    });
  },

  methods: {
    play() {
      const vm = this;
      if (vm.$root.currentPlaying !== vm.index) {
        if (vm.$root.currentPlaying) {
          vm.$root.drops[vm.index].player.stop();
        }
        vm.$root.currentPlaying = vm.index;
        vm.$root.drops[vm.index].player.play();
      }
    },
    stop() {
      const vm = this;
      vm.$root.drops[vm.index].player.stop();
      clearInterval(vm.interval);
    },

    updateProgress() {
      const player = this.$root.drops[this.index].player;
      this.progress = ((100 / player.duration()) * player.seek()).toFixed(2);
    },
  },

  computed: {
    dropDate() {
      return new Date(this.drop.date).toLocaleDateString();
    },

    dropTime() {
      const dropDate = new Date(this.drop.date);

      // we pass undefined as the locale to let us pass options without overriding the host locale
      const hours = dropDate.getHours().toLocaleString(undefined, { minimumIntegerDigits: 2 });
      return `${hours}:${leftPad(dropDate.getMinutes())}`;
    },

    dropTimecode() {
      const minutes = Math.floor(this.duration / 60).toString();
      const seconds = leftPad(Math.floor(this.duration % 60));
      return `${minutes}:${seconds}`;
    },
  },
};
</script>
