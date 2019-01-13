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
    <BundleForm
      ref="form"
      :bundleId="bundleId"
      :initialValues="bundle"
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
    BundleForm,
    PageTitle,
    Section,
  },

  inject: ['server'],

  data() {
    return {
      bundle: null,
      users: [],
    };
  },

  computed: {
    bundleId() {
      return this.$route.params.bundleId;
    },
    messageId() {
      return this.$route.params.messageId;
    },
  },

  async mounted() {
    try {
      this.bundle = await this.server.send('bundles/show', {
        id: this.bundleId,
      });
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
        _id: this.bundleId,
        messageId: this.messageId,
        title: formData.title,
        userIds: formData.userIds,
        users: formData.users,
      };

      try {
        const newBundle = await this.server.send('bundles/update', sendData);
        console.log(newBundle);
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
        pageTitle: 'Edit bundle',
        save: 'Save',
      },
      ru: {
        pageTitle: 'Редактирование рассылки',
        save: 'Сохранить',
      },
    },
  },

};
</script>
