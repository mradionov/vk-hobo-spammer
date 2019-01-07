<template>
  <div>
    <p>You need to authorize with your VK account in order to send messages</p>
    <Button @click.native="handleAuthorize">
      Authorize
    </Button>
  </div>
</template>

<script>
import Button from '../presenters/Button';

export default {
  components: {
    Button,
  },

  inject: ['server'],

  methods: {
    async handleAuthorize() {
      try {
        await this.server.send('auth/login');
        this.$router.push({ name: 'messageIndex' });
      } catch (err) {
        console.error(err);
        alert(err);
      }
    },
  },
};
</script>
