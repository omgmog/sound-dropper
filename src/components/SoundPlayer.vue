 <template>
  <div class="is-flex is-flex-direction-row">
    <span class="is-flex-grow-1">
      <strong>{{ drop.name }}</strong> {{dropDate}} at {{dropTime}} ({{dropTimecode}})
      <br>ID:{{ $root.drops[index].id }}
    </span>
    <button v-on:click="play"
    v-if="!$root.isPlaying || ($root.currentPlaying != index)"
    class="button is-primary is-align-self-flex-end">
      Play
    </button>
    <button v-on:click="stop"
    v-if="$root.isPlaying && ($root.currentPlaying == index)"
    class="button is-danger is-align-self-flex-end">
      Stop
    </button>
  </div>
</template>

<script>
import { Howl } from 'howler';

const leftPad = (val) => `0${val}`.substr(-2);

export default {
  name: 'SoundPlayer',
  props: ['drop', 'index'],
  data: () => ({
    duration: 0,
    isPlaying: false,
    date: null,
  }),

  mounted() {
    const vm = this;
    vm.$root.drops[vm.index].player = new Howl({
      src: [`/drops/${vm.drop.path}`],
    });

    vm.$root.drops[vm.index].player.on('load', () => {
      vm.duration = vm.$root.drops[vm.index].player.duration();
      // update the player id for the drop in the root drops list based on Howler's player
      vm.$root.drops[vm.index].id = vm.$root.drops[vm.index].player._sounds[0]._id;
    });
    vm.$root.drops[vm.index].player.on('play', () => {
      vm.$root.isPlaying = true;

      vm.$root.currentPlaying = vm.index;
    });
    vm.$root.drops[vm.index].player.on('stop', () => {
      vm.$root.isPlaying = false;

      vm.$root.currentPlaying = null;
    });
    vm.$root.drops[vm.index].player.on('end', () => {
      vm.$root.isPlaying = false;

      vm.$root.currentPlaying = vm.index + 1;

      if (vm.$root.currentPlaying < vm.$root.drops.length) {
        vm.$root.drops[vm.$root.currentPlaying].player.play();
      } else {
        vm.$root.currentPlaying = null;
        vm.$root.drops[vm.$root.currentPlaying].player.stop();
      }
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
