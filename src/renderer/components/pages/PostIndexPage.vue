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
          <th>
            Actions
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
          <td>
            <ButtonLink
              :class="$style.editButton"
              :to="{
                name: 'postEdit',
                params: {
                  messageId: $route.params.messageId,
                  postId: post.id,
                },
              }"
            >
              Edit
            </ButtonLink>
            <Button @click="onRemove(post)">
              Remove
            </Button>
          </td>
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

import Button from '../basic/Button';
import ButtonLink from '../basic/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
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
      const messageId = Number(this.$route.params.messageId);
      ipcRenderer.send('app:post/index/request', messageId);
      ipcRenderer.once('app:post/index/success', (ev, posts) => {
        this.posts = posts;
      });
    },

    onRemove(post) {
      const isRemoveConfirmed = window.confirm('Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      ipcRenderer.send('app:post/remove/request', post.id);
      ipcRenderer.once('app:post/remove/success', () => {
        this.fetch();
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

.editButton {
  margin-right: 5px;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
