<template>
  <div>
    <PageTitle>
      Edit Bundle
    </PageTitle>
    <BundleForm
      :initialValues="bundle"
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
      'getBundleById': 'bundles/getById',
      'getPostsAllByBundle': 'posts/getAllByBundle',
    }),
  },

  data() {
    return {
      bundle: null,
      posts: [],
    };
  },

  mounted() {
    this.bundle = this.getBundleById(this.bundleId);
    this.posts = this.getPostsAllByBundle(this.bundleId);
  },

  methods: {
    ...mapActions({
      updateBundle: 'bundles/update',
      createPost: 'posts/create',
      removePost: 'posts/remove',
    }),

    submit(formData) {
      const messageId = this.messageId;
      const bundleId = this.bundleId;

      const bundleData = {
        ...this.bundle,
        messageId,
        title: formData.title,
        userIds: formData.userIds,
      };

      const newUsers = formData.users;
      const newUserIds = newUsers.map(user => user.id);

      const prevUserIds = this.bundle.userIds;
      const addedUsers = newUsers.filter(user =>
        !prevUserIds.includes(user.id),
      );

      addedUsers.forEach((user) => {
        const postData = {
          bundleId,
          user,
        };

        this.createPost(postData);
      });

      const removedPostIds = this.posts.filter(post =>
        !newUserIds.includes(post.user.id),
      );
      removedPostIds.forEach((post) => {
        this.removePost(post.id);
      });

      this.updateBundle(bundleData);

      this.$router.go(-1);
    },
  },

};
</script>
