<template>
  <div id="controls">
    <button
      v-if="!isRecording"
      v-on:click="startRecording"
      class="button is-primary"
    >
      Drop
    </button>
    <button
      v-if="isRecording"
      v-on:click="stopRecording"
      class="button is-primary"
    >
      Stop
    </button>
    <button
      v-if="isRecording"
      v-on:click="cancelRecording"
      class="button is-danger"
    >
      Cancel
    </button>
    <span v-if="isRecording">🔴</span>
  </div>
</template>

<script>
export default {
  name: 'DropAdder',

  data: () => ({
    isRecording: false,
    recordingData: [],
    audio: null,
    recorder: null,
  }),

  methods: {
    async startRecording() {
      this.audio = this.audio || new AudioContext();
      const selectedDevice = localStorage.getItem('device') || 'default';
      const constraints = { audio: { deviceId: selectedDevice } };

      const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((err) => console.log(err));
      const target = this.audio.createGain();
      const source = this.audio.createMediaStreamSource(stream);

      const analyser = this.audio.createAnalyser();
      analyser.fftSize = 256;

      this.data = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);
      source.connect(target);

      this.audio.resume();

      this.recorder = new MediaRecorder(stream);
      this.recorder.start();
      this.recorder.ondataavailable = (e) => {
        this.recordingData.push(e.data);
      };

      this.isRecording = true;
    },
    stopRecording() {
      this.audio.suspend();
      this.recorder.stop();

      this.recorder.onstop = () => {
        const blob = new Blob(this.recordingData, {
          type: 'audio/ogg; codecs=opus',
        });

        const data = new FormData();
        // TODO username.value
        data.append('username', localStorage.getItem('name'));
        data.append(
          'file',
          new File([blob], 'upload.ogg', { type: blob.type }),
        );

        console.log('data');

        fetch('/drop', {
          method: 'POST',
          mode: 'cors',
          body: data,
        })
          .then((result) => {
            console.log(result);
            document.location.replace('/');
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        // Cleanup
        this.recordingData = [];
      };

      this.isRecording = false;
    },
    cancelRecording() {
      this.audio.suspend();
      this.recorder.onstop = () => {
        console.log('Stopped recording');
      };
      this.recorder.stop();

      this.recordingData = [];
      this.isRecording = false;
    },
  },
};
</script>
