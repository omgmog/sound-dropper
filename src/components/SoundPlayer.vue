 <template>
  <div class="drop-list-item flex justify-content-space-between">
    <div class="meta">
      <h4>{{ drop.name }} {{dropDate}} at {{dropTime}}</h4>
    </div>
    <div class="player flex align-items-center">
      <button
      v-on:click="play"
      v-if="!$root.isPlaying || ($root.currentPlaying != index)"
      class="button button-square button-icon button-pill button-success" title="Play">
        <SvgIcons icon="play" cssClass="icon-xxs" altText="Play"/>
      </button>
      <button
      v-on:click="stop"
      v-if="$root.isPlaying && ($root.currentPlaying == index)"
      class="button button-square button-icon button-error" title="Stop">
        <SvgIcons icon="stop" cssClass="icon-xxs" altText="Stop"/>
      </button>
      <progress max="100" v-bind:value="progress"></progress>
      <span class="length">({{dropTimecode}})</span>
    </div>
  </div>
</template>

<script>
import { Howl, Howler } from 'howler';
import SvgIcons from './SvgIcons.vue';

const leftPad = (val) => `0${val}`.substr(-2);

// clearInterval wrapper so we can debug easily
const clearTheInterval = (which) => {
  clearInterval(which);
};

export default {
  name: 'SoundPlayer',
  components: {
    SvgIcons,
  },
  props: ['drop', 'index'],
  data: () => ({
    duration: 0,
    date: null,
    player: null,
    progressInterval: null,
    progress: 0,
  }),

  mounted() {
    const vm = this;
    const root = vm.$root;
    const rootDrop = root.drops[vm.index];
    rootDrop.player = new Howl({
      src: [`/drops/${vm.drop.path}`],
    });

    rootDrop.player.on('load', () => {
      vm.duration = rootDrop.player.duration();
      // update the player id for the drop in the root drops list based on Howler's player
      const soundId = rootDrop.player._sounds[0]._id;
      rootDrop.id = soundId;
    });
    rootDrop.player.on('play', () => {
      root.currentPlaying = vm.index;

      const intervalStep = rootDrop.player.duration();
      vm.progressInterval = setInterval(() => {
        vm.updateProgress();
      }, intervalStep);
    });
    rootDrop.player.on('stop', () => {
      root.currentPlaying = null;

      clearTheInterval(vm.progressInterval);
    });
    rootDrop.player.on('end', () => {
      vm.progress = 100;

      root.currentPlaying = vm.index + 1;
      if (root.currentPlaying < root.drops.length) {
        // play the next one
        root.drops[root.currentPlaying].player.play();
      } else {
        // stop
        Howler.stop();
        root.currentPlaying = null;
      }
      clearTheInterval(vm.progressInterval);
    });
  },

  methods: {
    play() {
      const vm = this;
      const root = vm.$root;
      const rootDrop = root.drops[vm.index];

      Howler.stop();

      rootDrop.player.play();
    },
    stop() {
      const vm = this;
      const root = vm.$root;
      const rootDrop = root.drops[vm.index];

      rootDrop.player.stop();
    },

    updateProgress() {
      const vm = this;
      const root = vm.$root;
      const rootDrop = root.drops[vm.index];

      this.progress = ((100 / rootDrop.player.duration()) * rootDrop.player.seek()).toFixed(2);
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
