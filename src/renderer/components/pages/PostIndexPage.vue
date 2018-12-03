<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <ButtonLink
          slot="actions"
          :to="{
            name: 'postCreate',
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
          <th>
            ID
          </th>
          <th>
            Created at
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="$style.row"
          v-for="post in posts"
        >
          <td>{{post.id}}</td>
          <td>{{post.createdAt | date}}</td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasPosts">
      No posts yet
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import ButtonLink from '../basic/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    ButtonLink,
    PageTitle,
  },

  filters: {
    date(value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleString('ru-RU');
      return formattedDate;
    },
  },

  data() {
    return {
      posts: [],
    };
  },

  computed: {
    hasPosts() {
      return this.posts.length > 0;
    },
  },

  mounted() {
    this.fetch();
  },

  methods: {
    fetch() {
      const messageId = this.$route.params.messageId;
      ipcRenderer.send('app:post/index/request', messageId);
      ipcRenderer.once('app:post/index/success', (ev, posts) => {
        this.posts = posts;
      });
    },

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
