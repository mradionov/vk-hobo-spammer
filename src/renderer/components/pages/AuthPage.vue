<template>
  <div>
    <p>You need to authorize with your VK account in order to send messages</p>
    <Button @click.native="authorize">
      Authorize
    </Button>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import Button from '../basic/Button';

export default {
  components: {
    Button,
  },

  created() {
    ipcRenderer.once('app:auth/login/success', async (ev, accessToken) => {
      this.$store.commit('login', { accessToken });
    });
    ipcRenderer.once('app:auth/login/failure', (ev, err) => {
      console.error(err);
      alert('Login failed');
    });
  },

  methods: {
    authorize() {
      ipcRenderer.send('app:auth/login/request');
    },
  },
};
</script>
