import { createApp } from 'vue';
import App from './App.vue';

import 'bulma/css/bulma.css';

createApp(App).mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
