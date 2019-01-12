import Vue from 'vue';
import VueI18n from 'vue-i18n'

import IPCRouterClient from './services/IPCRouterClient';

import dateHelper from './helpers/dateHelper';

import createRouter from './router/router';

import App from './components/app/App';

import { DEFAULT_LOCALE } from '../constants/locale';

const server = new IPCRouterClient();

const router = createRouter();

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: DEFAULT_LOCALE,
});

const app = new Vue({

  i18n,
  router,

  provide: {
    server,
  },

  async created() {
    i18n.locale = await server.send('locale');

    server.listen('locale/update', async () => {
      i18n.locale = await server.send('locale');
    });
  },

  render: h => h(App),

});

Vue.filter('date', dateHelper.format);

app.$mount('[data-app]');
