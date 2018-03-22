<template>
  <div class="container">
    <div class="title">
      VK Hobo Spammer
    </div>
    <div class="profile" v-if="hasProfile">
      <img
        class="photo"
        :src="photoUrl"
      />
      <div class="name">
        {{name}}
      </div>
      <button
        class="logoutButton"
        @click="onLogoutClick"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {

  props: {
    profile: {
      type: Object,
      default: null,
    },
  },

  computed: {
    hasProfile() {
      return this.profile !== null;
    },
    name() {
      return this.profile.first_name;
    },
    photoUrl() {
      return this.profile.photo_50;
    },
  },

  methods: {
    onLogoutClick() {
      this.$emit('logout');
    },
  },

};
</script>

<style scoped>
  .container {
    align-items: center;
    background: #4a76a8;
    color: #fff;
    display: flex;
    font-size: 13px;
    justify-content: space-between;
    height: 42px;
    padding: 0 20px;
  }

  .title {
    font-weight: 700;
  }

  .profile {
    align-items: center;
    display: flex;
  }

  .photo {
    border-radius: 50%;
    height: 28px;
    margin-right: 10px;
    width: 28px;
  }

  .name {
    margin-right: 30px;
  }

  .logoutButton {
    border: 0;
    background: transparent;
    color: #fff;
    height: 42px;
    padding: 0 15px;
  }

  .logoutButton:hover {
    background: #3d6898;
    cursor: pointer;
  }

</style>
