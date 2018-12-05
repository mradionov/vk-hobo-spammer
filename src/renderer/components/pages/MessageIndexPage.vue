<template>
  <div>
    <PageTitle>
      Messages
      <ButtonLink
        slot="actions"
        to="/message/create"
      >
        Create message
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
              :class="$style.editButton"
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
                name: 'postIndex',
                params: { messageId: message.id }
              }"
            >
              Show posts
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
import Button from '../basic/Button';
import ButtonLink from '../basic/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    ButtonLink,
    PageTitle,
  },

  inject: ['ipc'],

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

  mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      this.ipc.send('app:message/index/request');
      this.ipc.once('app:message/index/success', (ev, messages) => {
        this.messages = messages;
      });
    },

    onRemove(message) {
      const isRemoveConfirmed = window.confirm('Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      this.ipc.send('app:message/remove/request', message.id);
      this.ipc.once('app:message/remove/success', () => {
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

.editButton {
  margin-right: 5px;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
