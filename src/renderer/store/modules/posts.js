import Vue from 'vue';

import { POST_STATUSES } from '../../constants/post';

const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
  },

  mutations: {
    create: (state, payload) => {
      const ids = state.ids.length ? state.ids : [0];
      const maxId = Math.max(ids);
      const id = maxId + 1;

      const post = payload;
      post.id = id;
      post.createdAt = Date.now();
      post.status = POST_STATUSES.idle;

      state.ids.push(id);
      state.map[id] = post;

      return id;
    },
    setStatus: (state, { id, status }) => {
      Vue.set(state.map[id], 'status', status);
    },
    remove: (state, idToRemove) => {
      state.ids = state.ids.filter(id => id !== idToRemove);
      delete state.map[idToRemove];
    },
  },

  actions: {
    send: ({ commit }, id) => {
      commit('setStatus', { id, status: POST_STATUSES.progress });

      return new Promise((resolve) => {
        setTimeout(() => {
          commit('setStatus', { id, status: POST_STATUSES.success });

          resolve();
        }, 2000);
      });
    },
  },

};

export default module;
