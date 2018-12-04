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
import { ipcRenderer } from 'electron';

import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    MessageForm,
    PageTitle,
  },

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
      ipcRenderer.send('app:message/get/request', this.$route.params.messageId);
      ipcRenderer.once('app:message/get/success', (ev, message) => {
        this.message = message;
      });
    },

    onSubmit(data) {
      ipcRenderer.send('app:message/update/request', data.id, data);
      ipcRenderer.once('app:message/update/success', () => {
        this.$router.push('/message/index');
      });
      ipcRenderer.once('app:message/update/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
