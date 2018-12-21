const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
  },

  getters: {
    all(state) {
      return state.ids.map(id => state.map[id]);
    },
    getById(state) {
      return (id) => {
        return state.map[id];
      };
    },
    getAllByMessage(state, getters) {
      return (messageId) => {
        return getters.all.filter(bundle => bundle.messageId === messageId);
      };
    },
  },

  mutations: {
    add(state, bundle) {
      state.ids.push(bundle.id);
      state.map[bundle.id] = bundle;
    },
    update(state, payload) {
      const id = payload.id;

      state.map[id] = payload;
    },
    remove(state, idToRemove) {
      state.ids = state.ids.filter(id => id !== idToRemove);
      delete state.map[idToRemove];
    },
  },

  actions: {
    create({ commit, state }, payload) {
      const ids = state.ids.length ? state.ids : [0];
      const maxId = Math.max(...ids);
      const id = maxId + 1;

      const bundle = payload;
      bundle.id = id;
      bundle.createdAt = Date.now();
      bundle.status = 'idle';

      commit('add', bundle);

      return id;
    },

    update({ commit }, payload) {
      commit('update', payload);
    },

    remove({ commit, dispatch }, id) {
      commit('remove', id);
      dispatch('posts/removeAllByBundle', id, { root: true });
    },

    removeAllByMessage({ dispatch, getters }, messageId) {
      const bundles = getters.getAllByMessage(messageId);

      bundles.forEach((bundle) => {
        dispatch('remove', bundle.id);
      });
    },
  },

};

export default module;
