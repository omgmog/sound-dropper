<template>
  <div id="controls" class="toolbar-recorder flex justify-content-center">
    <Notification ref="recordingNotification">Recording</Notification>
    <Notification ref="savedNotification">Recording saved</Notification>
    <Notification ref="discardedNotification" msgType="error">Recording discarded</Notification>
    <div
      v-if="$root.isLoggedIn">
      <div v-if="!isRecording">
        <button
          v-on:click="startRecording"
          class="button button-pill button-xxl button-success"
        >Drop</button>
      </div>
      <div v-else>
        <button
          v-on:click="stopRecording"
          class="button button-pill button-xxl button-success"
          >Stop</button>
        <button
          v-on:click="cancelRecording"
          class="button button-pill button-error margin-horizontal-s"
          >Cancel</button>
      </div>
    </div>
    <div
      v-else
    >
    <button
      class="button button-pill button-xxl button-disabled"
      disabled>Drop</button>
    </div>
  </div>
</template>

<script>
import Notification from './Notification.vue';

export default {
  name: 'DropAdder',
  components: {
    Notification,
  },

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
      this.$refs.recordingNotification.show();
    },
    stopRecording() {
      this.audio.suspend();
      this.recorder.stop();

      this.recorder.onstop = () => {
        const blob = new Blob(this.recordingData, {
          type: 'audio/ogg; codecs=opus',
        });

        const data = new FormData();
        data.append('username', localStorage.getItem('name') || 'anonymous');
        data.append(
          'file',
          new File([blob], 'upload.ogg', { type: blob.type }),
        );

        fetch('/drop', {
          method: 'POST',
          mode: 'cors',
          body: data,
        })
          .then((result) => {
            console.log(result);
            document.location.replace('/');
            this.$refs.savedNotification.show();
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
      this.$refs.discardedNotification.show();
    },
  },
};
</script>
