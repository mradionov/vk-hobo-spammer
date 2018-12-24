<template>
  <div>
    <PageTitle>
      Create Message
    </PageTitle>
    <MessageForm
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import Button from '../presenters/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    MessageForm,
    PageTitle,
  },

  methods: {
    ...mapActions({
      'createMessage': 'messages/create',
    }),

    submit(data) {
      this.createMessage(data);
      this.$router.push('/message/index');
    },

  },

};
</script>
