<template>
  <div>
    <TheHeader
      :profile="profile"
      @logout="handleLogout"
    />
    <div :class="$style.navigation">
      <NavBackButton
        v-if="$route.meta.canBack"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import NavBackButton from './NavBackButton';
import TheHeader from './TheHeader';

export default {

  components: {
    TheHeader,
    NavBackButton,
  },

  inject: ['server'],

  data() {
    return {
      profile: null,
    };
  },

  async mounted() {
    try {
      this.profile = await this.server.send('profile');
      this.$router.push({ name: 'messageIndex' });
    } catch (err) {
      console.error(err);
      alert(err);

      this.$router.push({ name: 'auth' });
    }

    this.server.onSuccess('auth/login', async () => {
      try {
        this.profile = await this.server.send('profile');
      } catch (err) {
        console.error(err);
        alert(err);

        this.$router.push({ name: 'auth' });
      }
    });
  },

  methods: {
    async handleLogout() {
      await this.server.send('auth/logout');
      this.profile = null;
      this.$router.push({ name: 'auth' });
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
.navigation {
  margin: 10px 0 0 20px;
  min-height: 30px;
  padding-left: 20px;
}
</style>
