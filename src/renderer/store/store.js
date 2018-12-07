import Vue from 'vue';
import Vuex from 'vuex';

import rootGetters from './rootGetters';
import rootMutations from './rootMutations';

import setupPersist from './setup/setupPersist';
import setupHTTP from './setup/setupHTTP';

import bundles from './modules/bundles';
import messages from './modules/messages';
import session from './modules/session';

function createStore({ ipc, http }) {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    getters: rootGetters,
    mutations: rootMutations,
    modules: {
      bundles,
      messages,
      session,
    },
  });

  setupHTTP(store, http);
  setupPersist(store, ipc);

  return store;
}

export default createStore;
