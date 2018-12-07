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
    initialValues: {
      type: Object,
      default: () => ({
        userIds: [],
      }),
    },
  },

  inject: ['api'],

  data() {
    return {
      fields: this.initialValues || {
        userIds: [],
      },
      friends: [],
      recepients: [],
    };
  },

  watch: {
    initialValues(initialValues) {
      this.fields = initialValues;
    },
  },

  async mounted() {
    try {
      this.friends = await this.api.getFriends();

      this.friends.forEach((user) => {
        if (this.fields.userIds.includes(user.id)) {
          this.recepients.push(user);
        }
      });
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    onSave() {
      this.$emit('submit', this.fields);
    },
    onFriendSelect(selectedUser) {
      if (this.fields.userIds.includes(selectedUser.id)) {
        return;
      }

      this.recepients.push(selectedUser);
      this.fields.userIds.push(selectedUser.id);
    },
    onRecepientSelect(selectedUser) {
      this.recepients = this.recepients.filter(user => user.id !== selectedUser.id);
      this.fields.userIds = this.fields.userIds.filter(id => id !== selectedUser.id);
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
