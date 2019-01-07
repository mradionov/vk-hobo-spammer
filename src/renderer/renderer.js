import Vue from 'vue';

import IPCRouterClient from './services/IPCRouterClient';

import dateHelper from './helpers/dateHelper';

import createRouter from './router/router';

import App from './components/app/App';

const server = new IPCRouterClient();

const router = createRouter();

const app = new Vue({

  router,

  provide: {
    server,
  },

  render: h => h(App),

});

Vue.filter('date', dateHelper.format);

app.$mount('[data-app]');
