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

import Button from '../presenters/Button';

export default {
  components: {
    Button,
  },

  inject: ['ipc'],

  methods: {
    ...mapMutations('session', [
      'setAccessToken',
    ]),

    authorize() {
      this.ipc.send('app:auth/login/request');
      this.ipc.on('app:auth/login/success', (ev, accessToken) => {
        this.setAccessToken(accessToken);
      });
      this.ipc.on('app:auth/login/failure', () => {
        // TODO
      });
    },
  },
};
</script>
