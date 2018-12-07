const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
  },

  getters: {
    all: state => state.ids.map(id => state.map[id]),
    hasAny: state => state.ids.length > 0,
    getAllByMessage: (state, getters) =>
      messageId =>
        getters.all.filter(bundle => bundle.messageId === messageId),
    getById: state => id => state.map[id],
  },

  mutations: {
    create: (state, payload) => {
      const ids = state.ids.length ? state.ids : [0];
      const maxId = Math.max(ids);
      const id = maxId + 1;

      const bundle = payload;
      bundle.id = id;
      bundle.createdAt = Date.now();

      state.ids.push(id);
      state.map[id] = bundle;
    },
    update: (state, payload) => {
      const id = payload.id;

      state.map[id] = payload;
    },
    remove: (state, idToRemove) => {
      state.ids = state.ids.filter(id => id !== idToRemove);
      delete state.map[idToRemove];
    },
  },

};

export default module;
