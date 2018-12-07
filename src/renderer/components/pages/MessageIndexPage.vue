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
    <table
      :class="$style.table"
      v-if="hasAny"
    >
      <thead>
        <tr :class="$style.row">
          <th :class="$style.idCell">
            ID
          </th>
          <th>
            Title
          </th>
          <th>
            Created at
          </th>
          <th>
            Actions
          </th>
          <th>
            Bundles
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="$style.row"
          v-for="message in messages"
        >
          <td>{{message.id}}</td>
          <td>{{message.title}}</td>
          <td>{{message.createdAt | date}}</td>
          <td>
            <ButtonLink
              :class="$style.editButton"
              :to="{
                name: 'messageEdit',
                params: { messageId: message.id }
              }"
            >
              Edit
            </ButtonLink>
            <Button @click="confirmRemove(message)">
              Remove
            </Button>
          </td>
          <td>
            <ButtonLink
              :to="{
                name: 'bundleIndex',
                params: { messageId: message.id }
              }"
            >
              Show bundles
            </ButtonLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasAny">
      No messages yet
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

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
    ...mapGetters('messages', {
      messages: 'all',
      hasAny: 'hasAny',
    }),
  },

  methods: {
    ...mapMutations('messages', [
      'remove',
    ]),

    confirmRemove(message) {
      const isRemoveConfirmed = window.confirm('Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      this.remove(message.id);
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

.idCell {
  width: 40px;
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
