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
import { mapGetters, mapMutations } from 'vuex';

import PageTitle from '../presenters/PageTitle';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    BundleForm,
    PageTitle,
  },

  computed: {
    ...mapGetters('bundles', [
      'getById',
    ]),
  },

  data() {
    return {
      bundle: null,
    };
  },

  mounted() {
    this.bundle = this.getById(this.$route.params.bundleId);
  },

  methods: {
    ...mapMutations('bundles', [
      'update',
    ]),

    submit(data) {
      const { messageId } = this.$route.params;

      this.update(data);
      this.$router.push({ name: 'bundleIndex', params: { messageId }});
    },
  },

};
</script>
