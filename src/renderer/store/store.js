import Vue from 'vue';
import Vuex from 'vuex';

import messages from './modules/messages';
import session from './modules/session';

Vue.use(Vuex);

function createStore() {
  const store = new Vuex.Store({

    getters: {
      accessToken: state => state.session.accessToken,
      isAuthenticated: state => state.session.accessToken !== null,
    },

    modules: {
      messages,
      session,
    },

  });

  return store;
}

export default createStore;
