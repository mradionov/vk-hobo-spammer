<template>
  <div>
    <PageTitle>
      {{$t('pageTitle')}}

      <Button
        slot="actions"
        @click="$refs.form.requestSubmit()"
      >
        {{$t('save')}}
      </Button>
    </PageTitle>

    <MessageForm
      v-if="message"
      ref="form"
      :model="message"
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

  data() {
    return {
      message: null,
    };
  },

  computed: {
    messageId() {
      return this.$route.params.messageId;
    },
  },

  async mounted() {
    this.message = await this.server.send('messages/show', {
      id: this.messageId,
    });
  },

  methods: {

    async handleSubmit(formData) {
      try {
        const message = await this.server.send('messages/update', this.message);
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
        save: 'Save',
      },
      ru: {
        pageTitle: 'Редактирование сообщения',
        save: 'Сохранить',
      },
    },
  },

};
</script>
