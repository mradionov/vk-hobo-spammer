<template>
  <div>
    <PageTitle>
      {{$t('pageTitle')}}
    </PageTitle>
    <MessageForm
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import Button from '../presenters/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    MessageForm,
    PageTitle,
  },

  inject: ['server'],

  methods: {

    async handleSubmit(formData) {
      try {
        const message = await this.server.send('messages/create', formData);
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
        pageTitle: 'New message',
      },
      ru: {
        pageTitle: 'Новое сообщение',
      },
    },
  },

};
</script>
