<template>
  <div>
    <PageTitle>
      Bundles
      <div slot="actions">
        <ButtonLink
          slot="actions"
          :to="{
            name: 'bundleCreate',
            params: { messageId }
          }"
        >
          Create bundle
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
      No bundles yet
    </NoItemsMessage>
  </div>
</template>

<script>
import BundleList from '../presenters/BundleList';
import ButtonLink from '../presenters/ButtonLink';
import NoItemsMessage from '../presenters/NoItemsMessage';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    BundleList,
    ButtonLink,
    NoItemsMessage,
    PageTitle,
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

    this.server.listen('postSender/update', this.handlePostSenderUpdate);
  },

  destroyed() {
    this.server.unlisten('postSender/update', this.handlePostSenderUpdate);
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
        this.policy = await this.server.send('bundles/policy');
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
      const isRemoveConfirmed = window.confirm(
        'All posts will be removed. Are you sure?',
      );
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

    handlePostSenderUpdate() {
      this.fetchBundles();
      this.fetchPolicy();
    },
  },

};
</script>
