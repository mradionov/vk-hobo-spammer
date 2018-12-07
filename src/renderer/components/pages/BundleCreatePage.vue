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
import { mapMutations } from 'vuex';

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
    ...mapMutations('bundles', [
      'create',
    ]),

    submit(data) {
      const messageId = this.$route.params.messageId;

      data.messageId = messageId;

      this.create(data);
      this.$router.push({ name: 'postIndex', params: { messageId }});
    },

  },

};
</script>
