<template>
  <div>
    <div :class="$style.group">
      <FriendList
        :users="friends"
        @select="onFriendSelect"
      />
      <RecepientList
        :users="recepients"
        @select="onRecepientSelect"
      />
    </div>
    <hr />
    <div :class="$style.group ">
      <div :class="$style.label" />
      <div :class="$style.field">
        <Button @click="onSave">
          Save
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../presenters/Button';
import FriendList from '../presenters/FriendList';
import RecepientList from '../presenters/RecepientList';

export default {

  components: {
    Button,
    FriendList,
    RecepientList,
  },

  props: {
    userIds: {
      type: Array,
    },
  },

  inject: ['api'],

  data() {
    return {
      selectedUserIds: this.userIds || [],
      friends: [],
      recepients: [],
    };
  },

  watch: {
    userIds(userIds) {
      this.selectedUserIds = userIds;
    },
  },

  async mounted() {
    try {
      this.friends = await this.api.getFriends();

      this.friends.forEach((user) => {
        if (this.selectedUserIds.includes(user.id)) {
          this.recepients.push(user);
        }
      });
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    onSave() {
      const formData = {
        users: this.recepients,
      };
      this.$emit('submit', formData);
    },
    onFriendSelect(selectedUser) {
      if (this.selectedUserIds.includes(selectedUser.id)) {
        return;
      }

      this.recepients.push(selectedUser);
      this.selectedUserIds.push(selectedUser.id);
    },
    onRecepientSelect(selectedUser) {
      this.recepients = this.recepients.filter(user => user.id !== selectedUser.id);

      this.selectedUserIds = this.selectedUserIds.filter(id =>
        id !== selectedUser.id,
      );
    },
  },

};
</script>

<style module>
.group {
  display: flex;
}

.label {
  color: #656565;
  text-align: right;
  padding: 6px 12px 7px 0;
  width: 100px;
}
</style>
