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
    <table
      :class="$style.table"
      v-if="hasAny"
    >
      <thead>
        <tr :class="$style.row">
          <th>
            ID
          </th>
          <th>
            Created at
          </th>
          <th>
            Actions
          </th>
          <th>
            Posts
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="$style.row"
          v-for="bundle in bundles"
        >
          <td>{{bundle.id}}</td>
          <td>{{bundle.createdAt | date}}</td>
          <td>
            <ButtonLink
              :class="$style.editButton"
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
            <Button @click="confirmRemove(bundle)">
              Remove
            </Button>
          </td>
          <td>
            <ButtonLink
              :to="{
                name: 'postIndex',
                params: { bundleId: bundle.id }
              }"
            >
              Show posts
            </ButtonLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasAny">
      No bundles yet
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Button from '../presenters/Button';
import ButtonLink from '../presenters/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    ButtonLink,
    PageTitle,
  },

  filters: {
    date(value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleString('ru-RU');
      return formattedDate;
    },
  },

  computed: {
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

    hasAny() {
      return this.bundles.length > 0;
    }
  },

  methods: {
    ...mapActions('bundles', [
      'remove',
    ]),

    confirmRemove(bundle) {
      const isRemoveConfirmed = window.confirm('All posts will be removed. Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      this.remove(bundle.id);
    },
  },

};
</script>

<style module>
.table {
  text-align: left;
  width: 100%;
}

.row {
  border-bottom: 1px solid #e7e8ec;
}

.editButton {
  margin-right: 5px;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
