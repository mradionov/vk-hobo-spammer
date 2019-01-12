<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>{{$t('title')}}</HeaderCell>
      <HeaderCell>{{$t('text')}}</HeaderCell>
      <HeaderCell>{{$t('actions')}}</HeaderCell>
      <HeaderCell>{{$t('bundles')}}</HeaderCell>
    </HeaderRow>
    <Row
      v-for="message in messages"
      :class="$style.row"
      :key="message._id"
    >
      <Cell :class="$style.titleCell">
        {{message.title}}
      </Cell>
      <Cell :class="$style.textCell">
        {{message.text}}
      </Cell>
      <Cell :class="$style.actionCell">
        <Button
          :disabled="!canEdit"
          @click="$emit('edit', message)"
        >
          {{$t('edit')}}
        </Button>
        <Button
          :disabled="!canRemove"
          @click="$emit('remove', message)"
        >
          {{$t('remove')}}
        </Button>
      </Cell>
      <Cell :class="$style.bundlesCell">
        <Button
          @click="$emit('showBundles', message)"
        >
          {{$t('showBundles')}}
        </Button>
      </Cell>
    </Row>
  </Table>
</template>

<script>
import Button from '../presenters/Button';
import { Table, HeaderRow, HeaderCell, Row, Cell } from './Table';

export default {

  components: {
    Button,
    Cell,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
  },

  props: {
    messages: {
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
        text: 'Text',
        actions: 'Actions',
        bundles: 'Bundles',
        edit: 'Edit',
        remove: 'Remove',
        showBundles: 'Show bundles',
      },
      ru: {
        title: 'Название',
        text: 'Текст',
        actions: 'Действия',
        bundles: 'Рассылки',
        edit: 'Изменить',
        remove: 'Удалить',
        showBundles: 'Показать рассылки',
      },
    }
  },

};
</script>

<style module>
.row:hover {
  background: #f7f7f7;
}

.titleCell {
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.textCell {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actionCell {
  width: 250px;
}

.bundlesCell {
  width: 200px;
}
</style>
