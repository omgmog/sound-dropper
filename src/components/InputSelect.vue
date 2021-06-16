<template>
  <Notification ref="successNotification">Selection saved</Notification>
  <div class="toolbar-micselect select">
    <select v-model="device">
      <option v-for="device in devices" v-bind:key="device.deviceId" v-bind:value="device.deviceId">
        {{device.label}}
      </option>
    </select>
  </div>
</template>

<script>
import Notification from './Notification.vue';

export default {
  name: 'InputSelect',
  components: {
    Notification,
  },
  data: () => ({
    devices: [],
    device: localStorage.getItem('device') || 'default',
  }),
  async mounted() {
    // we need to wait for getUserMedia to get mic permission from the user
    // before we can enumerateDevices (or anything else)
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    if (localStorage.device) {
      this.device = localStorage.getItem('device');
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter((device) => device.kind === 'audioinput');
  },
  watch: {
    device(dev) {
      localStorage.setItem('device', dev);
      this.$refs.successNotification.show();
    },
  },
};
</script>
