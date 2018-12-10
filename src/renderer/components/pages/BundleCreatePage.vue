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
import { mapActions, mapMutations } from 'vuex';

import Button from '../presenters/Button';
import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    Button,
    PageTitle,
    BundleForm,
  },

  methods: {
    ...mapMutations({
      createPost: 'posts/create',
    }),
    ...mapActions({
      createBundle: 'bundles/create',
    }),

    async submit(formData) {
      const messageId = this.$route.params.messageId;

      const bundleData = {
        messageId,
      };

      const bundleId = await this.createBundle(bundleData);

      console.log({ bundleId });

      formData.userIds.forEach((userId) => {
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
