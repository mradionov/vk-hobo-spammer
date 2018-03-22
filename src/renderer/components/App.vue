<template>
  <div>
    <TheHeader
      :profile="profile"
      @logout="onLogout"
    />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import TheHeader from './TheHeader';

export default {

  components: {
    TheHeader,
  },

  inject: ['api', 'store'],

  data() {
    return {
      profile: null,
    };
  },

  created() {
    ipcRenderer.on('app:auth/login/success', async (ev, token) => {
      this.store.token = token;

      try {
        this.profile = await this.api.getProfile();
        this.$router.push('/job');
      } catch (err) {
        console.error(err);
      }
    });

    ipcRenderer.on('app:auth/logout/success', () => {
      this.store.token = null;
      this.profile = null;
      this.$router.push('/');
    });
  },

  methods: {
    onLogout() {
      ipcRenderer.send('app:auth/logout/request');
    },
  },

};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Helvetica Neue, sans-serif;
  font-size: 13px;
  font-weight: 400;
}

h3 {
  font-size: 18px;
  margin: 0 0 15px 0;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

textarea {
  font-family: Helvetica Neue, sans-serif;
  font-size: 13px;
  padding: 5px;
}
</style>

<style scoped>
.content {
  padding: 20px;
}
</style>
