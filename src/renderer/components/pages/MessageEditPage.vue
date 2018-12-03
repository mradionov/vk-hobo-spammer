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

  async mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      ipcRenderer.send('app:messages/get/request', this.$route.params.messageId);
      ipcRenderer.once('app:messages/get/success', (ev, message) => {
        this.message = message;
      });
    },

    onSubmit(data) {
      ipcRenderer.send('app:messages/update/request', data.id, data);
      ipcRenderer.once('app:messages/update/success', () => {
        this.$router.push('/messages');
      });
      ipcRenderer.once('app:messages/update/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>

<style module>

</style>
