<template>
  <div>
    <PageTitle>
      Create Message
      <div slot="actions">
        <BackButton />
      </div>
    </PageTitle>
    <MessageForm
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import BackButton from '../basic/BackButton';
import Button from '../basic/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    BackButton,
    Button,
    MessageForm,
    PageTitle,
  },

  methods: {

    onSubmit(data) {
      ipcRenderer.send('app:messages/create/request', data);
      ipcRenderer.once('app:messages/create/success', () => {
        this.$router.push('/messages');
      });
      ipcRenderer.once('app:messages/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
