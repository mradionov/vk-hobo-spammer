<template>
  <div>
    <PageTitle>
      Messages
      <ButtonLink
        slot="actions"
        to="/message/create"
      >
        Create
      </ButtonLink>
    </PageTitle>
    <table
      :class="$style.table"
      v-if="hasMessages"
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
            Posts
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
              :to="{
                name: 'messageEdit',
                params: { messageId: message.id }
              }"
            >
              Edit
            </ButtonLink>
            <Button @click="onRemove(message)">
              Remove
            </Button>
          </td>
          <td>
            <ButtonLink
              :to="{
                name: 'messagePosts',
                params: { messageId: message.id }
              }"
            >
              Posts
            </ButtonLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasMessages">
      No messages yet
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import Button from '../basic/Button';
import ButtonLink from '../basic/ButtonLink';
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

  data() {
    return {
      messages: [],
    };
  },

  computed: {
    hasMessages() {
      return this.messages.length > 0;
    },
  },

  async mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      ipcRenderer.send('app:messages/index/request');
      ipcRenderer.once('app:messages/index/success', (ev, messages) => {
        this.messages = messages;
      });
    },

    onRemove(message) {
      const isRemoveConfirmed = window.confirm('Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      ipcRenderer.send('app:messages/remove/request', message.id);
      ipcRenderer.once('app:messages/remove/success', () => {
        this.fetch();
      });
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

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
