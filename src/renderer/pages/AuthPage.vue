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

import Button from '../components/Button';

export default {
  components: {
    Button,
  },
  methods: {
    authorize() {
      ipcRenderer.send('app:auth/login/request');
    },
  },
};
</script>
