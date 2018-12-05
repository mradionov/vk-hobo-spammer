<template>
  <div>
    <p>You need to authorize with your VK account in order to send messages</p>
    <Button @click.native="authorize">
      Authorize
    </Button>
  </div>
</template>

<script>
import Button from '../basic/Button';

export default {
  components: {
    Button,
  },

  inject: ['ipc'],

  created() {
    this.ipc.once('app:auth/login/success', async (ev, accessToken) => {
      this.$store.commit('login', { accessToken });
    });
    this.ipc.once('app:auth/login/failure', (ev, err) => {
      console.error(err);
      alert('Login failed');
    });
  },

  methods: {
    authorize() {
      this.ipc.send('app:auth/login/request');
    },
  },
};
</script>
