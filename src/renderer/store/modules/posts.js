import Vue from 'vue';

import { POST_ERROR_CODES, POST_STATUSES } from '../../constants/post';

const module = {

  namespaced: true,

  state: {
    ids: [],
    map: {},

    queue: [],
    progressId: null,
  },

  getters: {
    all(state) {
      return state.ids.map(id => state.map[id]);
    },
    get(state) {
      return (id) => {
        return state.map[id];
      };
    },
    getAllByBundle(state, getters) {
      return (bundleId) => {
        return getters.all.filter(post => post.bundleId === bundleId);
      };
    },
    getAllIdleByBundle(state, getters) {
      return (bundleId) => {
        return getters.all.filter(post => post.bundleId === bundleId
          && post.status === POST_STATUSES.idle,
        );
      };
    },
    getAllFailedByBundle(state, getters) {
      return (bundleId) => {
        return getters.all.filter(post => post.bundleId === bundleId
          && post.status === POST_STATUSES.failed,
        );
      };
    },
    isAnyInProgress(state) {
      return state.progressId !== null;
    },
    isQueueEmpty(state) {
      return state.queue.length === 0;
    },
    nextQueueId(state) {
      return state.queue[0];
    },
  },

  mutations: {
    create(state, payload) {
      const ids = state.ids.length ? state.ids : [0];
      const maxId = Math.max(...ids);
      const id = maxId + 1;

      const post = payload;
      post.id = id;
      post.createdAt = Date.now();
      post.status = POST_STATUSES.idle;
      post.lastErrorCode = null;
      post.attempts = 0;

      state.ids.push(id);
      state.map[id] = post;

      return id;
    },

    remove(state, idToRemove) {
      state.ids = state.ids.filter(id => id !== idToRemove);
      delete state.map[idToRemove];
    },

    addToQueue(state, id) {
      state.queue.push(id);
      Vue.set(state.map[id], 'status', POST_STATUSES.queued);
    },

    shiftQueue(state, id) {
      if (state.queue[0] === id) {
        state.queue.shift();
      }
    },

    statusProgress(state, id) {
      state.progressId = id;
      Vue.set(state.map[id], 'status', POST_STATUSES.progress);
    },

    statusSent(state, id) {
      Vue.set(state.map[id], 'status', POST_STATUSES.sent);
      state.progressId = null;
    },

    statusFailed(state, { id, lastErrorCode }) {
      const post = state.map[id];

      Vue.set(post, 'status', POST_STATUSES.failed);
      Vue.set(post, 'lastErrorCode', lastErrorCode);
      Vue.set(post, 'attempts', post.attempts + 1);

      state.progressId = null;
    },
  },

  actions: {
    attemptSend({ commit, dispatch, getters, state }, id) {
      const post = getters.get(id);

      if (post.status === POST_STATUSES.progress
        || post.status === POST_STATUSES.sent
      ) {
        return;
      }

      if (post.status === POST_STATUSES.queued
        && !post.id === state.progressId
      ) {
        return;
      }

      if (getters.isAnyInProgress) {
        commit('addToQueue', id);
        return;
      }

      commit('statusProgress', id);

      setTimeout(() => {
        // commit('statusSent', id);
        commit('statusFailed', {
          id,
          lastErrorCode: POST_ERROR_CODES.unknown,
        });

        dispatch('attemptSendNext');
      }, 2000);
    },

    attemptSendNext({ commit, dispatch, getters }) {
      if (getters.isQueueEmpty) {
        return;
      }

      const queuedId = getters.nextQueueId;

      commit('shiftQueue', queuedId);

      dispatch('attemptSend', queuedId);
    },

    attemptSendAllByBundle({ dispatch, getters }, bundleId) {
      const idlePosts = getters.getAllIdleByBundle(bundleId);

      idlePosts.forEach((post) => {
        dispatch('attemptSend', post.id);
      });
    },

    attemptRetryAllByBundle({ dispatch, getters }, bundleId) {
      const failedPosts = getters.getAllFailedByBundle(bundleId);

      failedPosts.forEach((post) => {
        dispatch('attemptSend', post.id);
      });
    },

  },

};

export default module;
