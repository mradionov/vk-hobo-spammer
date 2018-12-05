<template>
  <div>
    <PageTitle>
      Edit Post
    </PageTitle>
    <PostForm
      :initialValues="post"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import PostForm from '../forms/PostForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    PostForm,
    PageTitle,
  },

  inject: ['ipc'],

  data() {
    return {
      post: null,
    };
  },

  mounted() {
    this.fetch();
  },

  methods: {
    fetch() {
      const { messageId, postId } = this.$route.params;

      this.ipc.send('app:post/get/request', messageId, postId);
      this.ipc.once('app:post/get/success', (ev, post) => {
        this.post = post;
      });
    },

    onSubmit(data) {
      const { messageId } = this.$route.params;

      this.ipc.send('app:post/update/request', data.id, data);
      this.ipc.once('app:post/update/success', () => {
        this.$router.push({
          name: 'postIndex',
          params: {
            messageId,
          },
        });
      });
      this.ipc.once('app:post/update/failure', (ev, err) => {
        console.error(err);
      });
    },
  },

};
</script>
