import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function createStore() {
  const store = new Vuex.Store({
    state: {
      auth: {
        accessToken: null,
      },
    },
    getters: {
      accessToken(state) {
        return state.auth.accessToken;
      },
      isAuthenticated(state) {
        return state.auth.accessToken !== null;
      },
    },
    mutations: {
      login(state, payload) {
        state.auth.accessToken = payload.accessToken;
      },
      logout(state) {
        state.auth.accessToken = null;
      },
    },
  });

  return store;
}

export default createStore;
