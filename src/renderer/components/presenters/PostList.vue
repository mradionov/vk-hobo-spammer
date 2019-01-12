<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>{{$t('userPhoto')}}</HeaderCell>
      <HeaderCell>{{$t('userID')}}</HeaderCell>
      <HeaderCell>{{$t('userName')}}</HeaderCell>
      <HeaderCell>{{$t('status')}}</HeaderCell>
      <HeaderCell>{{$t('lastError')}}</HeaderCell>
      <HeaderCell>{{$t('attempts')}}</HeaderCell>
      <HeaderCell>{{$t('actions')}}</HeaderCell>
    </HeaderRow>
    <Row
      v-for="post in posts"
      :class="$style.row"
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
            {{$t('retry')}}
          </span>
          <span v-else>
            {{$t('send')}}
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

import { POST_STATUSES } from '~/constants/post';

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

  i18n: {
    messages: {
      en: {
        userPhoto: 'Photo',
        userID: 'ID',
        userName: 'Name',
        status: 'Status',
        lastError: 'Last error',
        attempts: 'Attempts',
        actions: 'Actions',
        send: 'Send',
        retry: 'Retry',
      },
      ru: {
        userPhoto: 'Фото',
        userID: 'ID',
        userName: 'Имя',
        status: 'Статус',
        lastError: 'Последняя ошибка',
        attempts: 'Попыток',
        actions: 'Действия',
        send: 'Отправить',
        retry: 'Повторить',
      },
    },
  },

};
</script>

<style module>
.row:hover {
  background: #f7f7f7;
}

.photoCell {
  width: 100px;
}

.photo {
  width: 30px;
}
</style>
