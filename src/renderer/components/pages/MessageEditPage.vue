<template>
  <div>
    <PageTitle>
      Edit Message
    </PageTitle>
    <MessageForm
      :initialValues="message"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    MessageForm,
    PageTitle,
  },

  inject: ['ipc'],

  data() {
    return {
      message: null,
    };
  },

  mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      this.ipc.send('app:message/get/request', this.$route.params.messageId);
      this.ipc.once('app:message/get/success', (ev, message) => {
        this.message = message;
      });
    },

    onSubmit(data) {
      this.ipc.send('app:message/update/request', data.id, data);
      this.ipc.once('app:message/update/success', () => {
        this.$router.push('/message/index');
      });
      this.ipc.once('app:message/update/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
