<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>Title</HeaderCell>
      <HeaderCell>Text</HeaderCell>
      <HeaderCell>Random ID</HeaderCell>
      <HeaderCell>Actions</HeaderCell>
      <HeaderCell>Bundles</HeaderCell>
    </HeaderRow>
    <Row
      v-for="message in messages"
      :key="message._id"
    >
      <Cell :class="$style.titleCell">
        {{message.title}}
      </Cell>
      <Cell :class="$style.textCell">
        {{message.text}}
      </Cell>
      <Cell>{{message.randomId}}</Cell>
      <Cell :class="$style.actionCell">
        <Button
          :disabled="!canEdit"
          @click="$emit('edit', message)"
        >
          Edit
        </Button>
        <Button
          :disabled="!canRemove"
          @click="$emit('remove', message)"
        >
          Remove
        </Button>
      </Cell>
      <Cell :class="$style.bundlesCell">
        <Button
          @click="$emit('showBundles', message)"
        >
          Show bundles
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

};
</script>

<style module>
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
  width: 200px;
}

.bundlesCell {
  width: 150px;
}
</style>
