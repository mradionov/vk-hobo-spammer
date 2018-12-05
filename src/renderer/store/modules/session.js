const module = {

  namespaced: true,

  state: {
    accessToken: null,
  },

  mutations: {
    setAccessToken: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
};

export default module;
