<template>
  <div>
    <PageTitle>
      {{$t('pageTitle')}}
    </PageTitle>
    <MessageForm
      :initialValues="message"
      @submit="handleSubmit"
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

  inject: ['server'],

  computed: {
    messageId() {
      return this.$route.params.messageId;
    },
  },

  data() {
    return {
      message: null,
    };
  },

  async mounted() {
    this.message = await this.server.send('messages/show', {
      id: this.messageId,
    });
  },

  methods: {

    async handleSubmit(formData) {
      try {
        const message = await this.server.send('messages/update', formData);
        console.log(message);
        this.$router.push('/message/index');
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

  },

  i18n: {
    messages: {
      en: {
        pageTitle: 'Edit message',
      },
      ru: {
        pageTitle: 'Редактирование сообщения',
      },
    },
  },

};
</script>
