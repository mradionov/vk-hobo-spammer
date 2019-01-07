<template>
  <div>
    <PageTitle>
      Create Bundle
    </PageTitle>
    <BundleForm
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import Button from '../presenters/Button';
import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    Button,
    PageTitle,
    BundleForm,
  },

  inject: ['server'],

  computed: {
    messageId() {
      return this.$route.params.messageId;
    }
  },

  methods: {
    async handleSubmit(formData) {
      const sendData = {
        messageId: this.messageId,
        title: formData.title,
        userIds: formData.userIds,
      };

      try {
        const bundle = await this.server.send('bundles/create', sendData);
        console.log(bundle);
        this.$router.go(-1);
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

  },

};
</script>
