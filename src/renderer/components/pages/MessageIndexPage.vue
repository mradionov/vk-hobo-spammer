<template>
  <div>
    <PageTitle>
      Messages
      <ButtonLink
        slot="actions"
        :to="{ name: 'messageCreate' }"
      >
        Create message
      </ButtonLink>
    </PageTitle>
    <Table v-if="hasAnyMessages">
      <HeaderRow slot="header">
        <HeaderCell>ID</HeaderCell>
        <HeaderCell>Title</HeaderCell>
        <HeaderCell>Created at</HeaderCell>
        <HeaderCell>Actions</HeaderCell>
        <HeaderCell>Bundles</HeaderCell>
      </HeaderRow>
      <Row
        v-for="message in messages"
        :key="message.id"
      >
        <Cell>{{message.id}}</Cell>
        <Cell>{{message.title}}</Cell>
        <Cell>{{message.createdAt | date}}</Cell>
        <Cell>
          <ButtonLink
            :class="$style.editButton"
            :disabled="!canEdit"
            :to="{
              name: 'messageEdit',
              params: { messageId: message.id }
            }"
          >
            Edit
          </ButtonLink>
          <Button
            :disabled="!canRemove"
            @click="confirmRemove(message)"
          >
            Remove
          </Button>
        </Cell>
        <Cell>
          <ButtonLink
            :to="{
              name: 'bundleIndex',
              params: { messageId: message.id }
            }"
          >
            Show bundles
          </ButtonLink>
        </Cell>
      </Row>
    </Table>
    <NoItemsMessage v-if="!hasAnyMessages">
      No messages yet
    </NoItemsMessage>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Button from '../presenters/Button';
import ButtonLink from '../presenters/ButtonLink';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

export default {

  components: {
    Button,
    ButtonLink,
    NoItemsMessage,
    PageTitle,
    Table,
    HeaderRow,
    HeaderCell,
    Row,
    Cell,
  },

  computed: {
    ...mapGetters({
      messages: 'messages/all',
      canEdit: 'canEdit',
      canRemove: 'canRemove',
    }),
    hasAnyMessages() {
      return this.messages.length > 0;
    }
  },

  methods: {
    ...mapActions({
      removeMessage: 'messages/remove'
    }),

    confirmRemove(message) {
      const isRemoveConfirmed = window.confirm(
        'All bundles and posts for this message will be removed.' +
        ' Are you sure?',
      );
      if (!isRemoveConfirmed) {
        return;
      }

      this.removeMessage(message.id);
    },

  },

};
</script>

<style module>
.editButton {
  margin-right: 5px;
}
</style>
