<template>
  <Section>
    <PageTitle>
      {{$t('pageTitle')}}
      <div slot="actions">
        <ButtonLink
          slot="actions"
          :to="{
            name: 'bundleCreate',
            params: { messageId }
          }"
        >
          {{$t('create')}}
        </ButtonLink>
      </div>
    </PageTitle>
    <BundleList
      v-if="hasAnyBundles"
      :bundles="bundles"
      :canEdit="policy.canEdit"
      :canRemove="policy.canRemove"
      @edit="handleEdit"
      @remove="handleRemove"
      @showPosts="handleShowPosts"
    />
    <NoItemsMessage v-if="!hasAnyBundles">
      {{$t('noItems')}}
    </NoItemsMessage>
  </Section>
</template>

<script>
import BundleList from '../presenters/BundleList';
import ButtonLink from '../presenters/ButtonLink';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';
import Section from '../presenters/Section';

export default {

  components: {
    BundleList,
    ButtonLink,
    NoItemsMessage,
    PageTitle,
    Section,
  },

  inject: ['server'],

  data() {
    return {
      bundles: [],
      policy: {
        canEdit: true,
        canRemove: true,
      },
    };
  },

  computed: {
    messageId() {
      return this.$route.params.messageId;
    },
    hasAnyBundles() {
      return this.bundles.length > 0;
    }
  },

  mounted() {
    this.fetchBundles();
    this.fetchPolicy();

    this.server.listen('sender/update', this.handleSenderUpdate);
  },

  destroyed() {
    this.server.unlisten('sender/update', this.handleSenderUpdate);
  },

  methods: {
    async fetchBundles() {
      try {
        this.bundles = await this.server.send('bundles/index', {
          messageId: this.messageId,
        });
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

    async fetchPolicy() {
      try {
        const sender = await this.server.send('sender');
        const isSending = sender.isInProgress || sender.hasQueueItems;

        this.policy.canEdit = !isSending;
        this.policy.canRemove = !isSending;
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },

    handleEdit(bundle) {
      this.$router.push({
        name: 'bundleEdit',
        params: {
          messageId: this.messageId,
          bundleId: bundle._id,
        },
      });
    },

    async handleRemove(bundle) {
      const isRemoveConfirmed = window.confirm(this.$t('removeConfirmation'));
      if (!isRemoveConfirmed) {
        return;
      }

      try {
        await this.server.send('bundles/remove', {
          id: bundle._id,
        });
      } catch (err) {
        console.error(err);
        alert(err);
      }

      await this.fetchBundles();
    },

    handleShowPosts(bundle) {
      this.$router.push({
        name: 'postIndex',
        params: {
          bundleId: bundle._id,
        },
      });
    },

    handleSenderUpdate() {
      this.fetchBundles();
      this.fetchPolicy();
    },
  },

  i18n: {
    messages: {
      en: {
        pageTitle: 'Bundles',
        create: 'Create bundle',
        noItems: 'No bundles',
        removeConfirmation: 'All posts for this bundles will be removed. Are you sure?',
      },
      ru: {
        pageTitle: 'Рассылки',
        create: 'Создать рассылку',
        noItems: 'Нет рассылок',
        removeConfirmation: 'Все посты для данной рассылки будут удалены. Вы уверены?',
      },
    },
  },

};
</script>
