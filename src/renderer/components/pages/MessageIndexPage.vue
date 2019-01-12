<template>
  <div>
    <PageTitle>
      {{$t('pageTitle')}}
      <ButtonLink
        slot="actions"
        :to="{ name: 'messageCreate' }"
      >
        {{$t('create')}}
      </ButtonLink>
    </PageTitle>
    <MessageList
      v-if="hasAnyMessages"
      :canEdit="policy.canEdit"
      :canRemove="policy.canRemove"
      :messages="messages"
      @edit="handleEdit"
      @remove="handleRemove"
      @showBundles="handleShowBundles"
    />
    <NoItemsMessage v-if="!hasAnyMessages">
      {{$t('noItems')}}
    </NoItemsMessage>
  </div>
</template>

<script>
import ButtonLink from '../presenters/ButtonLink';
import MessageList from '../presenters/MessageList';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    ButtonLink,
    MessageList,
    NoItemsMessage,
    PageTitle,
  },

  inject: ['server'],

  data() {
    return {
      messages: [],
      policy: {
        canEdit: true,
        canRemove: true,
      },
    };
  },

  computed: {
    hasAnyMessages() {
      return this.messages.length > 0;
    }
  },

  mounted() {
    this.fetchMessages();
    this.fetchPolicy();

    this.server.listen('postSender/update', this.handlePostSenderUpdate);
  },

  destroyed() {
    this.server.unlisten('postSender/update', this.handlePostSenderUpdate);
  },

  methods: {
    async fetchMessages() {
      try {
        this.messages = await this.server.send('messages/index');
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

    async fetchPolicy() {
      try {
        this.policy = await this.server.send('messages/policy');
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

    handleEdit(message) {
      this.$router.push({
        name: 'messageEdit',
        params: {
          messageId: message._id,
        },
      });
    },

    async handleRemove(message) {
      const isRemoveConfirmed = window.confirm(this.$t('removeConfirmation'));
      if (!isRemoveConfirmed) {
        return;
      }

      try {
        await this.server.send('messages/remove', {
          id: message._id,
        });
      } catch(err) {
        console.error(err);
        alert(err);
      }

      await this.fetchMessages();
    },

    handleShowBundles(message) {
      this.$router.push({
        name: 'bundleIndex',
        params: {
          messageId: message._id,
        },
      });
    },

    handlePostSenderUpdate(update) {
      this.fetchMessages();
      this.fetchPolicy();
    },

  },

  i18n: {
    messages: {
      en: {
        pageTitle: 'Messages',
        create: 'Create message',
        noItems: 'No messages',
        removeConfirmation: 'All bundles and posts for this message will be removed. Are you sure?',
      },
      ru: {
        pageTitle: 'Сообщения',
        create: 'Создать сообщение',
        noItems: 'Нет сообщений',
        removeConfirmation: 'Все рассылки и посты для данного сообщения будут удалены. Вы уверены?',
      },
    }
  },

};
</script>
