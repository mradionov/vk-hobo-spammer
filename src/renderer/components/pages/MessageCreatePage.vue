<template>
  <div>
    <PageTitle>
      Create Message
    </PageTitle>
    <MessageForm
      @submit="onSubmit"
    />
  </div>
</template>

<script>
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

    onSubmit(data) {
      this.ipc.send('app:message/create/request', data);
      this.ipc.once('app:message/create/success', () => {
        this.$router.push('/message/index');
      });
      this.ipc.once('app:message/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
