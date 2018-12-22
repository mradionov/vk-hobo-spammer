<template>
  <div>
    <PageTitle>
      Bundles
      <div slot="actions">
        <ButtonLink
          slot="actions"
          :to="{
            name: 'bundleCreate',
            params: { messageId: $route.params.messageId }
          }"
        >
          Create bundle
        </ButtonLink>
      </div>
    </PageTitle>
    <Table v-if="hasAnyBundles">
      <HeaderRow slot="header">
        <HeaderCell>ID</HeaderCell>
        <HeaderCell>Created at</HeaderCell>
        <HeaderCell>Actions</HeaderCell>
        <HeaderCell>Posts</HeaderCell>
      </HeaderRow>
      <Row
        v-for="bundle in bundles"
        :key="bundle.id"
      >
        <Cell>{{bundle.id}}</Cell>
        <Cell>{{bundle.createdAt | date}}</Cell>
        <Cell>
          <ButtonLink
            :class="$style.editButton"
            :disabled="!canEdit"
            :to="{
              name: 'bundleEdit',
              params: {
                messageId: $route.params.messageId,
                bundleId: bundle.id,
              },
            }"
          >
            Edit
          </ButtonLink>
          <Button
            :disabled="!canRemove"
            @click="confirmRemove(bundle)"
          >
            Remove
          </Button>
        </Cell>
        <Cell>
          <ButtonLink
            :to="{
              name: 'postIndex',
              params: { bundleId: bundle.id }
            }"
          >
            Show posts
          </ButtonLink>
        </Cell>
      </Row>
    </Table>
    <NoItemsMessage v-if="!hasAnyBundles">
      No bundles yet
    </NoItemsMessage>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

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
      canEdit: 'canEdit',
      canRemove: 'canRemove',
    }),

    ...mapState('bundles', {
      bundles(state) {
        return state.ids
          .map(id => state.map[id])
          .filter(bundle => bundle.messageId === this.messageId);
      },
    }),

    messageId() {
      return Number(this.$route.params.messageId);
    },

    hasAnyBundles() {
      return this.bundles.length > 0;
    }
  },

  methods: {
    ...mapActions({
      'removeBundle': 'bundles/remove',
    }),

    confirmRemove(bundle) {
      const isRemoveConfirmed = window.confirm(
        'All posts will be removed. Are you sure?',
      );
      if (!isRemoveConfirmed) {
        return;
      }

      this.removeBundle(bundle.id);
    },
  },

};
</script>

<style module>
.editButton {
  margin-right: 5px;
}
</style>
