<template>
  <div>
    <p>You need to authorize with your VK account in order to send messages</p>
    <Button @click.native="authorize">
      Authorize
    </Button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import Button from '../basic/Button';

export default {
  components: {
    Button,
  },

  inject: ['ipc'],

  methods: {
    authorize() {
      this.ipc.send('app:auth/login/request');
    },
  },
};
</script>
