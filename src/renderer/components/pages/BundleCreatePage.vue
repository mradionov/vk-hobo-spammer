<template>
  <div>
    <PageTitle>
      Create Bundle
    </PageTitle>
    <BundleForm
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import Button from '../presenters/Button';
import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    Button,
    PageTitle,
    BundleForm,
  },

  computed: {
    messageId() {
      return Number(this.$route.params.messageId);
    }
  },

  methods: {
    ...mapActions({
      createPost: 'posts/create',
      createBundle: 'bundles/create',
    }),

    async submit(formData) {
      const messageId = this.messageId;

      const userIds = formData.users.map(user => user.id);

      const bundleData = {
        messageId,
        title: formData.title,
        userIds,
      };

      const bundleId = await this.createBundle(bundleData);

      formData.users.forEach((user) => {
        const postData = {
          bundleId,
          user,
        };

        this.createPost(postData);
      });

      this.$router.go(-1);
    },

  },

};
</script>
