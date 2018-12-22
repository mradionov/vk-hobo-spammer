const rootMutations = {

  // Use to set entire state when received from main process
  reset(state, savedState) {
    Object.keys(savedState).forEach((key) => {
      state[key] = savedState[key];
    });
  },

};

export default rootMutations;
