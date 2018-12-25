<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <Button @click="retryAll">
          Retry all failed
        </Button>
        <Button @click="sendAll">
          Send all idle
        </Button>
      </div>
    </PageTitle>
    <Table v-if="hasAnyPosts">
      <HeaderRow slot="header">
        <HeaderCell>ID</HeaderCell>
        <HeaderCell>User</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell>Last error</HeaderCell>
        <HeaderCell>Attempts</HeaderCell>
        <HeaderCell>Actions</HeaderCell>
      </HeaderRow>
      <Row
        v-for="post in posts"
        :key="post.id"
      >
        <Cell>{{post.id}}</Cell>
        <Cell>{{post.user.first_name}} {{post.user.last_name}}</Cell>
        <Cell>
          <StatusText :status="post.status" />
        </Cell>
        <Cell>
          <ErrorText :code="post.lastErrorCode" />
        </Cell>
        <Cell>{{post.attempts}}</Cell>
        <Cell>
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
        </Cell>
      </Row>
    </Table>
    <NoItemsMessage v-if="!hasAnyPosts">
      No posts yet
    </NoItemsMessage>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import Button from '../presenters/Button';
import ErrorText from '../presenters/ErrorText';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';
import StatusText from '../presenters/StatusText';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

import { POST_STATUSES } from '../../constants/post';

export default {

  components: {
    Button,
    ErrorText,
    NoItemsMessage,
    PageTitle,
    StatusText,
    Table,
    HeaderRow,
    HeaderCell,
    Row,
    Cell,
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

    hasAnyPosts() {
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
