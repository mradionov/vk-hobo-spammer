<template>
  <div>
    <TheHeader
      :profile="profile"
      @logout="logout"
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
import { mapMutations } from 'vuex';

import NavBackButton from './NavBackButton';
import TheHeader from './TheHeader';

export default {

  components: {
    TheHeader,
    NavBackButton,
  },

  inject: ['api'],

  data: () => ({
    profile: null,
  }),

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },

  watch: {
    async isAuthenticated(newIsAuthenticated, oldIsAuthenticated) {
      if (newIsAuthenticated) {
        await this.fetchProfile();
        this.$router.push({ name: 'messageIndex' });
        return;
      }

      this.resetProfile();
    }
  },

  mounted() {
    if (this.isAuthenticated) {
      this.$router.push({ name: 'messageIndex' });
    } else {
      this.$router.push({ name: 'auth' });
    }
  },

  methods: {
    ...mapMutations('session', [
      'clearAccessToken',
    ]),

    async fetchProfile() {
      try {
        this.profile = await this.api.getProfile();
      } catch (err) {
        if (err.error_code === 5) {
          window.alert(err.error_msg);
          this.logout();
          return;
        }
        console.error(err);
      }
    },

    resetProfile() {
      this.profile = null;
    },

    logout() {
      this.clearAccessToken();
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
