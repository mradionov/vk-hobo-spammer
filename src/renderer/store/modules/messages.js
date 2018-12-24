const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
    lastId: 0,
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
  },

  mutations: {
    create(state, messageData) {
      state.ids.push(messageData.id);
      state.map[messageData.id] = messageData;

      state.lastId = messageData.id;
    },
    update(state, messageData) {
      const id = messageData.id;

      state.map[id] = messageData;
    },
    remove(state, idToRemove) {
      state.ids = state.ids.filter(id => id !== idToRemove);
      delete state.map[idToRemove];
    },
  },

  actions: {
    create({ commit, state }, messageData) {
      const id = state.lastId + 1;

      const message = messageData;
      message.id = id;
      message.createdAt = Date.now();

      commit('create', message);

      return id;
    },

    update({ commit }, messageData) {
      commit('update', messageData);
    },

    remove({ commit, dispatch }, id) {
      commit('remove', id);
      dispatch('bundles/removeAllByMessage', id, { root: true });
    },
  },

};

export default module;
