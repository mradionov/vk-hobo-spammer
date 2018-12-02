<template>
  <div>
    <TheHeader
      :profile="profile"
      @logout="onLogout"
    />
    <div :class="$style.content">
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
        this.$router.push('/messages');
      } catch (err) {
        if (err.error_code === 5) {
          window.alert(err.error_msg);
          this.onLogout();
          return;
        }
        console.error(err);
      }
    });

    ipcRenderer.on('app:auth/logout/success', () => {
      this.store.token = null;
      this.profile = null;
      this.$router.push('/auth');
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
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  background: #edeef0;
  font-family: Helvetica Neue, sans-serif;
  font-size: 13px;
  font-weight: 400;
}

textarea {
  font-family: Helvetica Neue, sans-serif;
  font-size: 13px;
  padding: 5px;
}

hr {
  border: 0;
  border-top: 1px solid #e7e8ec;
  height: 0px;
  margin: 20px auto 20px;
}
</style>

<style module>
.content {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;
  margin: 20px;
  padding: 20px;
}
</style>
