const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},
  },

  getters: {
    getById: state => id => state.map[id],
  },

  mutations: {
    add: (state, bundle) => {
      state.ids.push(bundle.id);
      state.map[bundle.id] = bundle;
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

  actions: {
    create: ({ commit, state }, payload) => {
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
  },

};

export default module;
