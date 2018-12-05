import Vue from 'vue';
import { merge } from 'lodash';

import App from './components/app/App';

import HTTPClient from './lib/HTTPClient';
import IPCClient from './lib/IPCClient';
import VKApi from './lib/VKApi';

import createStore from './store/store';
import createRouter from './router';

const http = new HTTPClient({
  baseURL: 'https://api.vk.com/method',
  params: {
    v: '5.73',
  },
});
const api = new VKApi(http);
const ipc = new IPCClient();

const store = createStore();
const router = createRouter(store);

const app = new Vue({

  store,
  router,

  provide: {
    api,
    ipc,
  },

  created() {
    http.addOptionsInterceptor((options) => {
      const { accessToken } = this.$store.getters;

      if (accessToken === null) {
        return options;
      }

      return merge(options, {
        params: {
          access_token: accessToken,
        },
      });
    });

    ipc.on('app:auth/login/guest', () => {
      router.push('/auth');
    });
  },

  mounted() {
    ipc.send('app:renderer/ready');
  },

  render: h => h(App),

});

app.$mount('[data-app]');
