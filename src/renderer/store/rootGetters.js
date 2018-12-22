const rootGetters = {

  accessToken(state) {
    return state.session.accessToken;
  },

  isAuthenticated(state) {
    return state.session.accessToken !== null;
  },

  canEdit(state, getters) {
    const isPostsQueueEmpty = getters['posts/isQueueEmpty'];
    const isAnyPostInProgress = getters['posts/isAnyPostInProgress'];

    const canEdit = isPostsQueueEmpty && !isAnyPostInProgress;

    return canEdit;
  },

  canRemove(state, getters) {
    return getters.canEdit;
  },

};

export default rootGetters;
