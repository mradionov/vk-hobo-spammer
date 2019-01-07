<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>Title</HeaderCell>
      <HeaderCell>Waiting</HeaderCell>
      <HeaderCell>Sent</HeaderCell>
      <HeaderCell>Failed</HeaderCell>
      <HeaderCell>Total</HeaderCell>
      <HeaderCell>Actions</HeaderCell>
      <HeaderCell>Posts</HeaderCell>
    </HeaderRow>
    <Row
      v-for="bundle in bundles"
      :key="bundle._id"
    >
      <Cell :class="$style.titleCell">
        {{bundle.title}}
      </Cell>
      <Cell :class="$style.countCell">
        {{bundle.waitingPostsCount}}
      </Cell>
      <Cell :class="$style.sentCountCell">
        {{bundle.sentPostsCount}}
      </Cell>
      <Cell :class="$style.failedCountCell">
        {{bundle.failedPostsCount}}
      </Cell>
      <Cell :class="$style.countCell">
        {{bundle.totalPostsCount}}
      </Cell>
      <Cell :class="$style.actionCell">
        <Button
          :disabled="!canEdit"
          @click="$emit('edit', bundle)"
        >
          Edit
        </Button>
        <Button
          :disabled="!canRemove"
          @click="$emit('remove', bundle)"
        >
          Remove
        </Button>
      </Cell>
      <Cell :class="$style.postsCell">
        <Button
          @click="$emit('showPosts', bundle)"
        >
          Show posts
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

};
</script>

<style module>
.titleCell {
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.countCell {
  width: 80px;
}

.actionCell {
  width: 200px;
}

.postsCell {
  width: 135px;
}
</style>
