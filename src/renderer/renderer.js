import Vue from 'vue';

import HTTPClient from './lib/HTTPClient';
import IPCClient from './lib/IPCClient';
import VKApi from './lib/VKApi';

import createStore from './store/store';
import createRouter from './router/router';

import App from './components/app/App';

const http = new HTTPClient({
  baseURL: 'https://api.vk.com/method',
  params: {
    v: '5.73',
  },
});
const api = new VKApi(http);
const ipc = new IPCClient();

const store = createStore({ ipc, http });
const router = createRouter(store);

const app = new Vue({

  store,
  router,

  provide: {
    api,
    ipc,
  },

  mounted() {
    ipc.send('app:renderer/ready');
  },

  render: h => h(App),

});

app.$mount('[data-app]');
