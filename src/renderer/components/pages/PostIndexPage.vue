<template>
  <div>
    <PageTitle>
      Posts
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
            Created at
          </th>
          <th>
            User
          </th>
          <th>
            Status
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
          <td>{{post.createdAt | date}}</td>
          <td>{{post.userId}}</td>
          <td>{{post.status}}</td>
          <td>
            <Button
              :disabled="isAnyPostInProgress"
              @click="send(post)"
            >
              Send
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
      isAnyPostInProgress(state) {
        return state.ids
          .map(id => state.map[id])
          .some(post => post.status === POST_STATUSES.progress);
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
    ...mapActions('posts', {
      sendPost: 'send'
    }),

    async send(post) {
      await this.sendPost(post.id);
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
