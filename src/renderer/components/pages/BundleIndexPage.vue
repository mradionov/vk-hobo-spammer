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
        <HeaderCell>Waiting</HeaderCell>
        <HeaderCell>Sent</HeaderCell>
        <HeaderCell>Failed</HeaderCell>
        <HeaderCell>Total</HeaderCell>
        <HeaderCell>Actions</HeaderCell>
        <HeaderCell>Posts</HeaderCell>
      </HeaderRow>
      <Row
        v-for="bundle in bundles"
        :key="bundle.id"
      >
        <Cell>{{bundle.id}}</Cell>
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
        <Cell :class="$style.postsCell">
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
import StatusText from '../presenters/StatusText';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

export default {

  components: {
    Button,
    ButtonLink,
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
    ...mapGetters({
      countAllWaitingPostsByBundle: 'posts/countAllWaitingByBundle',
      countAllSentPostsByBundle: 'posts/countAllSentByBundle',
      countAllFailedPostsByBundle: 'posts/countAllFailedByBundle',
      countAllPostsByBundle: 'posts/countAllByBundle',
      canEdit: 'canEdit',
      canRemove: 'canRemove',
    }),

    ...mapState('bundles', {
      bundles(state) {
        return state.ids
          .map(id => state.map[id])
          .filter(bundle => bundle.messageId === this.messageId)
          .map((bundle) => {
            const waitingPostsCount = this.countAllWaitingPostsByBundle(bundle.id);
            const sentPostsCount = this.countAllSentPostsByBundle(bundle.id);
            const failedPostsCount = this.countAllFailedPostsByBundle(bundle.id);
            const totalPostsCount = this.countAllPostsByBundle(bundle.id);

            return {
              ...bundle,
              waitingPostsCount,
              sentPostsCount,
              failedPostsCount,
              totalPostsCount,
            };
          });
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
