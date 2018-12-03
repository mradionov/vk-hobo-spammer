import Vue from 'vue';
import { ipcRenderer } from 'electron';
import { merge } from 'lodash';

import App from './components/app/App';

import HTTPClient from './lib/HTTPClient';
import VKApi from './lib/VKApi';

import createRouter from './router';

const http = new HTTPClient({
  baseURL: 'https://api.vk.com/method',
  params: {
    v: '5.73',
  },
});
const api = new VKApi(http);

const store = {
  token: null,
};

const router = createRouter(store);

const app = new Vue({

  router,

  provide: {
    api,
    store,
  },

  created() {
    http.addOptionsInterceptor((options) => {
      if (store.token === null) {
        return options;
      }

      return merge(options, {
        params: {
          access_token: store.token,
        },
      });
    });

    ipcRenderer.on('app:auth/login/guest', () => {
      router.push('/auth');
    });
  },

  mounted() {
    ipcRenderer.send('app:renderer/ready');
  },

  render: h => h(App),

});

app.$mount('[data-app]');
