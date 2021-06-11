 <template>
  <div class="is-flex is-flex-direction-row">
    <span class="is-flex-grow-1">
      <strong>{{ drop.name }}</strong> {{dropDate}} at {{dropTime}} ({{dropTimecode}})
    </span>
    <button v-on:click="play" v-if="!isPlaying" class="button is-dark is-align-self-flex-end">
      Play
    </button>
    <button v-on:click="stop" v-if="isPlaying" class="button is-dark is-align-self-flex-end">
      Stop
    </button>
  </div>
</template>

<script>
import { Howl } from 'howler';

export default {
  name: 'SoundPlayer',
  props: ['drop'],
  data: () => ({
    player: null,
    duration: 0,
    isPlaying: false,
    date: null,
  }),

  mounted() {
    const vm = this;
    vm.player = new Howl({
      src: [`/drops/${vm.drop.path}`],
    });

    // this.date = vm.drop.path.split('-')[0];

    vm.player.on('load', () => {
      vm.duration = vm.player.duration();
    });
    vm.player.on('play', () => {
      vm.isPlaying = true;
    });
    vm.player.on('stop', () => {
      vm.isPlaying = false;
    });
    vm.player.on('end', () => {
      vm.isPlaying = false;
    });
  },

  methods: {
    play() {
      if (window.currentPlaying !== this.player) {
        if (window.currentPlaying) {
          window.currentPlaying.stop();
        }
        window.currentPlaying = this.player;
        this.player.play();
      }
    },
    stop() {
      this.player.stop();
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
      return `${hours}:${dropDate.getMinutes()}`;
    },

    dropTimecode() {
      let seconds = Math.floor(this.duration % 60).toString();
      const minutes = Math.floor(this.duration / 60).toString();
      if (seconds.length === 1) {
        seconds = `0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    },
  },
};
</script>
