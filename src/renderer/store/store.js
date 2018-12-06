import Vue from 'vue';
import Vuex from 'vuex';

import setupPersist from './setup/setupPersist';
import setupHTTP from './setup/setupHTTP';

import messages from './modules/messages';
import session from './modules/session';

function createStore({ ipc, http }) {
  Vue.use(Vuex);

  const store = new Vuex.Store({

    getters: {
      accessToken: state => state.session.accessToken,
      isAuthenticated: state => state.session.accessToken !== null,
    },

    mutations: {
      reset(state, savedState) {
        Object.keys(savedState).forEach((key) => {
          state[key] = savedState[key];
        });
      },
    },

    modules: {
      messages,
      session,
    },

  });

  setupHTTP(store, http);

  setupPersist(store, ipc);

  return store;
}

export default createStore;
