const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
  },

  getters: {
    all: state => state.ids.map(id => state.map[id]),
    getById: state => id => state.map[id],
  },

  mutations: {
    create: (state, payload) => {
      const ids = state.ids.length ? state.ids : [0];
      const maxId = Math.max(ids);
      const id = maxId + 1;

      const message = payload;
      message.id = id;
      message.createdAt = Date.now();

      state.ids.push(id);
      state.map[id] = message;
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
