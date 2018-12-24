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
import { mapGetters, mapActions } from 'vuex';

import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    MessageForm,
    PageTitle,
  },

  computed: {
    ...mapGetters({
      getMessageById: 'messages/getById',
    }),

    messageId() {
      return this.$route.params.messageId;
    },
  },

  data() {
    return {
      message: null,
    };
  },

  mounted() {
    this.message = this.getMessageById(this.messageId);
  },

  methods: {
    ...mapActions({
      'updateMessage': 'messages/update',
    }),

    submit(data) {
      this.updateMessage(data);
      this.$router.push('/message/index');
    },

  },

};
</script>
