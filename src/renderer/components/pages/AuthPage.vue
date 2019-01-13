<template>
  <Section>
    <p>{{$t('description')}}</p>
    <Button @click.native="handleAuthorize">
      {{$t('authorize')}}
    </Button>
  </Section>
</template>

<script>
import Button from '../presenters/Button';
import Section from '../presenters/Section';

export default {
  components: {
    Button,
    Section,
  },

  inject: ['server'],

  methods: {
    async handleAuthorize() {
      try {
        await this.server.send('auth/login');
        this.$router.push({ name: 'messageIndex' });
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },
  },

  i18n: {
    messages: {
      en: {
        authorize: 'Authorize',
        description: 'You need to authorize with your VK account in order to send messages',
      },
      ru: {
        authorize: 'Авторизоваться',
        description: 'Для отправки сообщений нужно авторизоваться с помощью ВК аккаунта',
      },
    }
  },
};
</script>
