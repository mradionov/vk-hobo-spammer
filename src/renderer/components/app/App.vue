<template>
  <div>
    <TheHeader
      :profile="profile"
      @logout="onLogout"
    />
    <div :class="$style.navigation">
      <NavBackButton
        v-if="$route.meta.canBack"
      />
    </div>
    <div :class="$style.content">
      <router-view />
    </div>
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

  inject: ['api', 'ipc'],

  data() {
    return {
      profile: null,
    };
  },

  created() {
    this.ipc.on('app:auth/login/success', async (ev, accessToken) => {
      this.$store.commit('login', { accessToken });

      try {
        this.profile = await this.api.getProfile();
        this.$router.replace('/message/index');
      } catch (err) {
        if (err.error_code === 5) {
          window.alert(err.error_msg);
          this.onLogout();
          return;
        }
        console.error(err);
      }
    });

    this.ipc.on('app:auth/logout/success', () => {
      this.$store.commit('logout');
      this.profile = null;
      this.$router.push('/auth');
    });
  },

  methods: {
    onLogout() {
      this.ipc.send('app:auth/logout/request');
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

.content {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;
  margin: 10px 20px 20px 20px;
  padding: 20px;
}
</style>
