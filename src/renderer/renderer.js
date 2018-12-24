import Vue from 'vue';

import HTTPClient from './services/HTTPClient';
import IPCClient from './services/IPCClient';
import VKApi from './services/VKApi';

import dateHelper from './helpers/dateHelper';

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

const store = createStore({ api, ipc, http });
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

Vue.filter('date', dateHelper.format);

app.$mount('[data-app]');
