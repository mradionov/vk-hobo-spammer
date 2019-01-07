<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <Button @click="handleRetryAll">
          Retry all failed
        </Button>
        <Button @click="handleSendAll">
          Send all idle
        </Button>
      </div>
    </PageTitle>
    <PostList
      v-if="hasAnyPosts"
      :posts="posts"
      @send="handleSend"
    />
    <NoItemsMessage v-if="!hasAnyPosts">
      No posts yet
    </NoItemsMessage>
  </div>
</template>

<script>
import Button from '../presenters/Button';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';
import PostList from '../presenters/PostList';

export default {

  components: {
    Button,
    NoItemsMessage,
    PageTitle,
    PostList,
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
    }
  },

  mounted() {
    this.fetch();

    this.server.listen('postSender/update', this.handlePostSenderUpdate);
  },

  destroyed() {
    this.server.unlisten('postSender/update', this.handlePostSenderUpdate);
  },

  methods: {
    async fetch() {
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
      this.server.send('posts/sendAllByBundle', {
        bundleId: this.bundleId,
      });
    },
    handleRetryAll() {
      this.server.send('posts/retryAllByBundle', {
        bundleId: this.bundleId,
      });
    },
    handlePostSenderUpdate() {
      this.fetch();
    },
  },

};
</script>
