const rootGetters = {

  accessToken(state) {
    return state.session.accessToken;
  },

  isAuthenticated(state) {
    return state.session.accessToken !== null;
  },

  canEdit(state, getters) {
    const hasPostsQueueItems = getters['posts/hasQueueItems'];
    const isAnyPostInProgress = getters['posts/isAnyInProgress'];

    const canEdit = !hasPostsQueueItems && !isAnyPostInProgress;

    return canEdit;
  },

  canRemove(state, getters) {
    return getters.canEdit;
  },

};

export default rootGetters;
