<template>
  <div>
    <PageTitle>
      Edit Message
    </PageTitle>
    <MessageForm
      :initialValues="message"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    MessageForm,
    PageTitle,
  },

  computed: {
    ...mapGetters('messages', [
      'getById',
    ]),
  },

  data: () => ({
    message: null,
  }),

  mounted() {
    this.message = this.getById(this.$route.params.messageId);
  },

  methods: {
    ...mapMutations('messages', [
      'update',
    ]),

    submit(data) {
      this.update(data);
      this.$router.push('/message/index');
    },

  },

};
</script>
