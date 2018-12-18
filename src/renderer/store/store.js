import Vue from 'vue';
import Vuex from 'vuex';

import rootGetters from './rootGetters';
import rootMutations from './rootMutations';

import setupPersist from './setup/setupPersist';
import setupHTTP from './setup/setupHTTP';

import session from './modules/session';
import messages from './modules/messages';
import bundles from './modules/bundles';
import posts from './modules/posts';

function createStore({ ipc, http }) {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    getters: rootGetters,
    mutations: rootMutations,
    modules: {
      session,
      messages,
      bundles,
      posts,
    },
  });

  setupHTTP(store, http);
  setupPersist(store, ipc);

  return store;
}

export default createStore;