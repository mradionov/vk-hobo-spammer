import Vue from 'vue';

import { VKError } from '../../services/VKApi';
import { POST_ERROR_CODES, POST_STATUSES } from '../../constants/post';

function createModule({ api }) {
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
      getAllWaitingByBundle(state, getters) {
        return (bundleId) => {
          return getters.all.filter(post => post.bundleId === bundleId
            && [
              POST_STATUSES.idle,
              POST_STATUSES.queued,
              POST_STATUSES.progress,
            ].includes(post.status),
          );
        };
      },
      getAllSentByBundle(state, getters) {
        return (bundleId) => {
          return getters.all.filter(post => post.bundleId === bundleId
            && post.status === POST_STATUSES.sent,
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
      countAllByBundle(state, getters) {
        return (bundleId) => {
          return getters.getAllByBundle(bundleId).length;
        };
      },
      countAllWaitingByBundle(state, getters) {
        return (bundleId) => {
          return getters.getAllWaitingByBundle(bundleId).length;
        };
      },
      countAllSentByBundle(state, getters) {
        return (bundleId) => {
          return getters.getAllSentByBundle(bundleId).length;
        };
      },
      countAllFailedByBundle(state, getters) {
        return (bundleId) => {
          return getters.getAllFailedByBundle(bundleId).length;
        };
      },
      isAnyInProgress(state) {
        return state.progressId !== null;
      },
      hasQueueItems(state) {
        return state.queue.length > 0;
      },
      nextQueueId(state) {
        return state.queue[0];
      },
    },

    mutations: {
      add(state, post) {
        state.ids.push(post.id);
        Vue.set(state.map, post.id, post);
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
        Vue.set(state.map[id], 'status', POST_STATUSES.progress);

        state.progressId = id;
      },

      statusSent(state, id) {
        Vue.set(state.map[id], 'status', POST_STATUSES.sent);
        Vue.set(state.map[id], 'lastErrorCode', null);

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
      async attemptSend({ commit, dispatch, getters, rootGetters }, id) {
        const post = getters.get(id);

        // If post is already in progress or sent, don't queue it and no need
        // to send it.
        if (post.status === POST_STATUSES.progress
          || post.status === POST_STATUSES.sent
        ) {
          return;
        }

        // If there is something currently sending, queue the post

        if (getters.isAnyInProgress) {
          commit('addToQueue', id);
          return;
        }

        const firstQueueId = getters.nextQueueId;
        if (firstQueueId === id) {
          commit('shiftQueue', id);
        }

        commit('statusProgress', id);

        const bundle = rootGetters['bundles/getById'](post.bundleId);
        const message = rootGetters['messages/getById'](bundle.messageId);

        try {
          const peerId = post.user.id;
          const randomId = message.id;
          const text = message.text;

          await api.sendMessage(peerId, randomId, text);

          commit('statusSent', id);

        } catch (err) {
          commit('statusFailed', {
            id,
            lastErrorCode: err.code,
          });
        }

        setTimeout(() => {
          dispatch('attemptSendNext');
        }, 1000);
      },

      attemptSendNext({ dispatch, getters }) {
        if (!getters.hasQueueItems) {
          return;
        }

        const queuedId = getters.nextQueueId;

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

      create({ commit, state }, payload) {
        const ids = state.ids.length ? state.ids : [0];
        const maxId = Math.max(...ids);
        const id = maxId + 1;

        const post = payload;
        post.id = id;
        post.createdAt = Date.now();
        post.status = POST_STATUSES.idle;
        post.lastErrorCode = null;
        post.attempts = 0;

        commit('add', post);

        return id;
      },

      remove({ commit }, id) {
        commit('remove', id);
      },

      removeAllByBundle({ dispatch, getters }, bundleId) {
        const posts = getters.getAllByBundle(bundleId);

        posts.forEach((post) => {
          dispatch('remove', post.id);
        });
      },

    },

  };

  return module;
}

export default createModule;
