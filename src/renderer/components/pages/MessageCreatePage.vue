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
import { ipcRenderer } from 'electron';

import Button from '../basic/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    MessageForm,
    PageTitle,
  },

  methods: {

    onSubmit(data) {
      ipcRenderer.send('app:message/create/request', data);
      ipcRenderer.once('app:message/create/success', () => {
        this.$router.push('/message/index');
      });
      ipcRenderer.once('app:message/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
