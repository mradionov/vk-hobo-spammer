<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>{{$t('title')}}</HeaderCell>
      <HeaderCell>{{$t('waiting')}}</HeaderCell>
      <HeaderCell>{{$t('sent')}}</HeaderCell>
      <HeaderCell>{{$t('failed')}}</HeaderCell>
      <HeaderCell>{{$t('total')}}</HeaderCell>
      <HeaderCell>{{$t('actions')}}</HeaderCell>
      <HeaderCell>{{$t('posts')}}</HeaderCell>
    </HeaderRow>
    <Row
      v-for="bundle in bundles"
      :key="bundle._id"
    >
      <Cell :class="$style.titleCell">
        {{bundle.title}}
      </Cell>
      <Cell :class="$style.waitingCell">
        {{bundle.waitingPostsCount}}
      </Cell>
      <Cell :class="$style.sentCountCell">
        {{bundle.sentPostsCount}}
      </Cell>
      <Cell :class="$style.failedCountCell">
        {{bundle.failedPostsCount}}
      </Cell>
      <Cell :class="$style.totalCell">
        {{bundle.totalPostsCount}}
      </Cell>
      <Cell :class="$style.actionCell">
        <Button
          :disabled="!canEdit"
          @click="$emit('edit', bundle)"
        >
          {{$t('edit')}}
        </Button>
        <Button
          :disabled="!canRemove"
          @click="$emit('remove', bundle)"
        >
          {{$t('remove')}}
        </Button>
      </Cell>
      <Cell :class="$style.postsCell">
        <Button
          @click="$emit('showPosts', bundle)"
        >
          {{$t('showPosts')}}
        </Button>
      </Cell>
    </Row>
  </Table>
</template>

<script>
import Button from './Button';
import ButtonLink from './ButtonLink';
import { Table, HeaderRow, HeaderCell, Row, Cell } from './Table';

export default {

  components: {
    Button,
    ButtonLink,
    Cell,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
  },

  props: {
    bundles: {
      type: Array,
      default: () => [],
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
    canRemove: {
      type: Boolean,
      default: true,
    },
  },

  i18n: {
    messages: {
      en: {
        title: 'Title',
        waiting: 'Waiting',
        sent: 'Sent',
        failed: 'Failed',
        total: 'Total',
        actions: 'Actions',
        posts: 'Posts',
        showPosts: 'Show posts',
        edit: 'Edit',
        remove: 'Remove',
      },
      ru: {
        title: 'Название',
        waiting: 'В ожидании',
        sent: 'Отправлено',
        failed: 'Ошибка',
        total: 'Всего',
        actions: 'Действия',
        posts: 'Посты',
        showPosts: 'Показать посты',
        edit: 'Изменить',
        remove: 'Удалить',
      },
    },
  },

};
</script>

<style module>
.titleCell {
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.waitingCell {
  width: 100px;
}

.sentCountCell {
  color: #40964c;
  font-weight: bold;
  width: 80px;
}

.failedCountCell {
  color: #de0400;
  font-weight: bold;
  width: 80px;
}

.totalCell {
  width: 80px;
}

.actionCell {
  width: 250px;
}

.postsCell {
  width: 200px;
}
</style>
