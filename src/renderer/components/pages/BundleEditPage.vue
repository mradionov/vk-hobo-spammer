<template>
  <div>
    <PageTitle>
      Edit Bundle
    </PageTitle>
    <BundleForm
      :initialValues="bundle"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    BundleForm,
    PageTitle,
  },

  inject: ['server'],

  data() {
    return {
      bundle: null,
    };
  },

  computed: {
    bundleId() {
      return this.$route.params.bundleId;
    },
    messageId() {
      return this.$route.params.messageId;
    },
  },

  async mounted() {
    try {
      this.bundle = await this.server.send('bundles/show', {
        id: this.bundleId,
      });
    } catch (err) {
      console.error(err);
      alert(err);
    }
  },

  methods: {
    async handleSubmit(formData) {
      const sendData = {
        _id: this.bundleId,
        messageId: this.messageId,
        title: formData.title,
        userIds: formData.userIds,
      };

      try {
        const newBundle = await this.server.send('bundles/update', sendData);
        console.log(newBundle);
        this.$router.go(-1);
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },
  },

};
</script>
