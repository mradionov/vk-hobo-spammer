<template>
  <div>
    <PageTitle>
      Edit Bundle
    </PageTitle>
    <BundleForm
      :initialValues="initialValues"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    BundleForm,
    PageTitle,
  },

  computed: {
    bundleId() {
      return Number(this.$route.params.bundleId);
    },
    messageId() {
      return Number(this.$route.params.messageId);
    },
    ...mapGetters({
      'getPostsAllByBundle': 'posts/getAllByBundle',
    }),
  },

  data() {
    return {
      initialValues: null,
      posts: [],
      userIds: [],
    };
  },

  mounted() {
    this.posts = this.getPostsAllByBundle(this.bundleId);

    const userIds = this.posts.map(post => post.userId);

    this.initialValues = {
      userIds,
    };
  },

  methods: {
    ...mapActions({
      createPost: 'posts/create',
      removePost: 'posts/remove',
    }),

    submit(data) {
      const messageId = this.messageId;
      const bundleId = this.bundleId;

      const prevUserIds = this.posts.map(post => post.userId);
      const newUserIds = data.userIds;

      const removedPostIds = this.posts.filter(post =>
        !newUserIds.includes(post.userId),
      );

      removedPostIds.forEach((post) => {
        this.removePost(post.id);
      });

      const addedUserIds = newUserIds.filter(userId =>
        !prevUserIds.includes(userId),
      );

      addedUserIds.forEach((userId) => {
        const postData = {
          bundleId,
          userId,
        };

        this.createPost(postData);
      });

      this.$router.push({ name: 'bundleIndex', params: { messageId }});
    },
  },

};
</script>
