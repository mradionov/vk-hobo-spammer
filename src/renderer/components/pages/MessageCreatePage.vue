<template>
  <Section>
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
  </Section>
</template>

<script>
import Button from '../presenters/Button';
import MessageForm from '../forms/MessageForm';
import PageTitle from '../presenters/PageTitle';
import Section from '../presenters/Section';

export default {

  components: {
    Button,
    MessageForm,
    PageTitle,
    Section,
  },

  inject: ['server'],

  data() {
    return {
      message: null,
    };
  },

  async mounted() {
    this.message = await this.server.send('messages/new');
  },

  methods: {

    async handleSubmit() {
      try {
        await this.server.send('messages/create', this.message);
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
        save: 'Save',
      },
      ru: {
        pageTitle: 'Новое сообщение',
        save: 'Сохранить',
      },
    },
  },

};
</script>
