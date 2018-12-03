<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <ButtonLink
          slot="actions"
          :to="{
            name: 'postsCreate',
            params: { messageId: $route.params.messageId }
          }"
        >
          Create post
        </ButtonLink>
      </div>
    </PageTitle>
    <table
      :class="$style.table"
      v-if="hasPosts"
    >
      <thead>
        <tr :class="$style.row">
          ID
        </tr>
      </thead>
      <tbody>
        <tr :class="$style.row">
          <td>1</td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasPosts">
      No posts yet
    </div>
  </div>
</template>

<script>
import ButtonLink from '../basic/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    ButtonLink,
    PageTitle,
  },

  computed: {
    hasPosts() {
      return false;
    },
  },

  mounted() {
    console.log(this.$router);
  },

};
</script>

<style module>
.table {
  text-align: left;
  width: 100%;
}

.row {
  border-bottom: 1px solid #e7e8ec;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
