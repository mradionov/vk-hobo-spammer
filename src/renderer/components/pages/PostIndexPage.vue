<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <Button @click="retryAll">
          Retry all
        </Button>
        <Button @click="sendAll">
          Send all
        </Button>
      </div>
    </PageTitle>
    <table
      :class="$style.table"
      v-if="hasAny"
    >
      <thead>
        <tr :class="$style.row">
          <th>
            ID
          </th>
          <th>
            User
          </th>
          <th>
            Created at
          </th>
          <th>
            Status
          </th>
          <th>
            Last error
          </th>
          <th>
            Attempts
          </th>
          <th>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="$style.row"
          v-for="post in posts"
        >
          <td>{{post.id}}</td>
          <td>{{post.userId}}</td>
          <td>{{post.createdAt | date}}</td>
          <td>{{post.status}}</td>
          <td>{{post.lastErrorCode || '-'}}</td>
          <td>{{post.attempts}}</td>
          <td>
            <Button
              @click="send(post)"
              :disabled="!canSend(post)"
            >
              <span v-if="isFailed(post)">
                Retry
              </span>
              <span v-else>
                Send
              </span>
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasAny">
      No posts yet
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import Button from '../presenters/Button';
import PageTitle from '../presenters/PageTitle';

import { POST_STATUSES } from '../../constants/post';

export default {

  components: {
    Button,
    PageTitle,
  },

  filters: {
    date(value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleString('ru-RU');
      return formattedDate;
    },
  },

  computed: {
    ...mapState('posts', {
      posts(state) {
        return state.ids
          .map(id => state.map[id])
          .filter(post => post.bundleId === this.bundleId);
      },
    }),

    bundleId() {
      return Number(this.$route.params.bundleId);
    },

    hasAny() {
      return this.posts.length > 0;
    }
  },

  methods: {
    ...mapActions('posts', [
      'attemptSend',
      'attemptSendAllByBundle',
      'attemptRetryAllByBundle',
    ]),

    send(post) {
      this.attemptSend(post.id);
    },

    sendAll() {
      this.attemptSendAllByBundle(this.bundleId);
    },

    retryAll() {
      this.attemptRetryAllByBundle(this.bundleId);
    },

    canSend(post) {
      return post.status === POST_STATUSES.idle
        || post.status === POST_STATUSES.failed;
    },

    isFailed(post) {
      return post.status === POST_STATUSES.failed;
    },
  },

};
</script>

<style module>
.table {
  text-align: left;
  width: 100%;
}

.row {
  border-bottom: 1px solid #e7e8ec;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
