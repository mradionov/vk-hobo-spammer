<template>
  <div>
    <PageTitle>
      Edit Bundle
    </PageTitle>
    <BundleForm
      :userIds="userIds"
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
    this.userIds = this.posts.map(post => post.user.id);
  },

  methods: {
    ...mapActions({
      createPost: 'posts/create',
      removePost: 'posts/remove',
    }),

    submit(formData) {
      const messageId = this.messageId;
      const bundleId = this.bundleId;

      const newUsers = formData.users;
      const newUserIds = newUsers.map(user => user.id);

      const prevUserIds = this.posts.map(post => post.user.id);
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

      this.$router.replace({ name: 'bundleIndex', params: { messageId }});
    },
  },

};
</script>
