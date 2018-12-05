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
import { mapMutations } from 'vuex';

import Button from '../basic/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    MessageForm,
    PageTitle,
  },

  inject: ['ipc'],

  methods: {
    ...mapMutations('messages', [
      'create',
    ]),

    submit(data) {
      this.create(data);
      this.$router.push('/message/index');
    },

  },

};
</script>
