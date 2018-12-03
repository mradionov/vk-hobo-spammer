<template>
  <div>
    <PageTitle>
      Create Post
    </PageTitle>
    <PostForm
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import Button from '../basic/Button';
import PostForm from '../forms/PostForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    PageTitle,
    PostForm,
  },

  methods: {

    onSubmit(data) {
      const messageId = this.$route.params.messageId;

      data.messageId = messageId;

      ipcRenderer.send('app:post/create/request', data);
      ipcRenderer.once('app:post/create/success', () => {
        this.$router.push({
          name: 'postIndex',
          params: {
            messageId,
          },
        });
      });
      ipcRenderer.once('app:post/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
