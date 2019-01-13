<template>
  <Section>
    <PageTitle>
      {{$t('pageTitle')}}
    </PageTitle>
    <BundleForm
      :users="users"
      @submit="handleSubmit"
    />
  </Section>
</template>

<script>
import Button from '../presenters/Button';
import PageTitle from '../presenters/PageTitle';
import Section from '../presenters/Section';

import BundleForm from '../forms/BundleForm';

export default {

  components: {
    Button,
    PageTitle,
    BundleForm,
    Section,
  },

  inject: ['server'],

  data() {
    return {
      users: [],
    };
  },

  computed: {
    messageId() {
      return this.$route.params.messageId;
    }
  },

  async mounted() {
    try {
      this.users = await this.server.send('users/index', {
        messageId: this.messageId,
      });
    } catch (err) {
      console.error(err);
      alert(err);
    }
  },

  methods: {
    async handleSubmit(formData) {
      const sendData = {
        messageId: this.messageId,
        title: formData.title,
        userIds: formData.userIds,
        users: formData.users,
      };

      try {
        const bundle = await this.server.send('bundles/create', sendData);
        this.$router.go(-1);
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

  },

  i18n: {
    messages: {
      en: {
        pageTitle: 'New bundle',
      },
      ru: {
        pageTitle: 'Новая рассылка',
      },
    },
  },

};
</script>
