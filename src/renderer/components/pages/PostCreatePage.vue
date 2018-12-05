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
import Button from '../basic/Button';
import PostForm from '../forms/PostForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    PageTitle,
    PostForm,
  },

  inject: ['ipc'],

  methods: {

    onSubmit(data) {
      const messageId = this.$route.params.messageId;

      data.messageId = messageId;

      this.ipc.send('app:post/create/request', data);
      this.ipc.once('app:post/create/success', () => {
        this.$router.push({
          name: 'postIndex',
          params: {
            messageId,
          },
        });
      });
      this.ipc.once('app:post/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>
