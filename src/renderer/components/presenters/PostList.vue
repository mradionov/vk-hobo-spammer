<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>User Photo</HeaderCell>
      <HeaderCell>User ID</HeaderCell>
      <HeaderCell>User Name</HeaderCell>
      <HeaderCell>Status</HeaderCell>
      <HeaderCell>Last error</HeaderCell>
      <HeaderCell>Attempts</HeaderCell>
      <HeaderCell>Actions</HeaderCell>
    </HeaderRow>
    <Row
      v-for="post in posts"
      :key="post._id"
    >
      <Cell :class="$style.photoCell">
        <img
          :class="$style.photo"
          :src="post.user.photo_50"
        />
      </Cell>
      <Cell>{{post.user.id}}</Cell>
      <Cell :class="$style.nameCell">
        {{post.user.first_name}} {{post.user.last_name}}
      </Cell>
      <Cell>
        <StatusText :status="post.status" />
      </Cell>
      <Cell>
        <ErrorText :code="post.lastErrorCode" />
      </Cell>
      <Cell>{{post.attempts}}</Cell>
      <Cell>
        <Button
          @click="$emit('send', post)"
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
</template>

<script>
import Button from '../presenters/Button';
import ErrorText from '../presenters/ErrorText';
import StatusText from '../presenters/StatusText';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

import { POST_STATUSES } from '../../constants/post';

export default {

  components: {
    Button,
    Cell,
    HeaderCell,
    HeaderRow,
    ErrorText,
    Row,
    StatusText,
    Table,
  },

  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
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
.photoCell {
  width: 100px;
}

.photo {
  width: 30px;
}
</style>
