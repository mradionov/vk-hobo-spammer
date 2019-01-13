<template>
  <Section>
    <PageTitle>
      {{$t('pageTitle')}}
      <div slot="actions">
        <Button @click="handleSendAll">
          {{$t('sendAll')}}
        </Button>
        <Button @click="handleRetryAll">
          {{$t('retryAll')}}
        </Button>
      </div>
    </PageTitle>
    <PostList
      v-if="hasAnyPosts"
      :posts="posts"
      @send="handleSend"
    />
    <NoItemsMessage v-if="!hasAnyPosts">
      {{$t('noItems')}}
    </NoItemsMessage>
  </Section>
</template>

<script>
import Button from '../presenters/Button';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';
import PostList from '../presenters/PostList';
import Section from '../presenters/Section';

import { POST_STATUSES } from '~/constants/post';

export default {

  components: {
    Button,
    NoItemsMessage,
    PageTitle,
    PostList,
    Section,
  },

  inject: ['server'],

  data() {
    return {
      posts: [],
    };
  },

  computed: {
    bundleId() {
      return this.$route.params.bundleId;
    },
    hasAnyPosts() {
      return this.posts.length > 0;
    },
  },

  mounted() {
    this.fetchPosts();

    this.server.listen('sender/update', this.handleSenderUpdate);
  },

  destroyed() {
    this.server.unlisten('sender/update', this.handleSenderUpdate);
  },

  methods: {
    async fetchPosts() {
      try {
        this.posts = await this.server.send('posts/index', {
          bundleId: this.bundleId,
        });
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

    handleSend(post) {
      this.server.send('posts/send', {
        id: post._id,
      });
    },

    handleSendAll() {
      const isConfirmed = window.confirm(this.$t('sendAllConfirmation'));
      if (!isConfirmed) {
        return;
      }

      this.server.send('posts/sendAllByBundle', {
        bundleId: this.bundleId,
      });
    },

    handleRetryAll() {
      const isConfirmed = window.confirm(this.$t('retryAllConfirmation'));
      if (!isConfirmed) {
        return;
      }

      this.server.send('posts/retryAllByBundle', {
        bundleId: this.bundleId,
      });
    },

    handleContinue() {
      console.log('handleContinue');
    },

    handleSenderUpdate() {
      this.fetchPosts();
    },

  },

  i18n: {
    messages: {
      en: {
        pageTitle: 'Posts',
        retryAll: 'Retry all failed',
        sendAll: 'Send all idle',
        sendAllConfirmation: 'Are you sure you want to mass send all idle messages?',
        retryAllConfirmation: 'Are you sure you want to mass re-send all failed messages?',
        noItems: 'No posts',
      },
      ru: {
        pageTitle: 'Посты',
        retryAll: 'Повторить все с ошибкой',
        sendAll: 'Отправить все в ожидании',
        sendAllConfirmation: 'Вы уверены что хотите массово отправить все сообщения в ожидании?',
        retryAllConfirmation: 'Вы уверены что хотите массово повторно отправить все сообщения с ошибкой?',
        noItems: 'Нет постов',
      },
    },
  },

};
</script>
