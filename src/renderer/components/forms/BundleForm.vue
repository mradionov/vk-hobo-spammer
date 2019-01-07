<template>
  <form @submit="handleSubmit">
    <Group>
      <Label>Title</Label>
      <Field>
        <input
          type="text"
          :class="$style.input"
          v-model.trim="fields.title"
          maxlength="50"
          required
        />
      </Field>
    </Group>

    <hr />

    <Group>
      <Label>Users</Label>
      <Field>
        <div :class="$style.users">
          <div :class="$style.list">
            <UserList
              v-if="hasAnyUsers"
              :filterByName="filter.name"
              :selected="fields.userIds"
              :users="users"
              @select="toggleSelection"
            />
            <NoItemsMessage v-if="isFetching">
              Loading ...
            </NoItemsMessage>
            <NoItemsMessage v-if="isFetched && !hasAnyUsers">
              No friends :(
            </NoItemsMessage>
          </div>
          <div :class="$style.filter">
            <h3>Filter</h3>
            <UserFilter
              @change="handleFilterChange"
              @reset="handleFilterReset"
            />
          </div>
        </div>
      </Field>
    </Group>

    <hr />

    <Group>
      <Label />
      <Field>
        <Button type="submit">
          Save
        </Button>
      </Field>
    </Group>
  </form>
</template>

<script>
import Button from '../presenters/Button';
import NoItemsMessage from '../presenters/NoItemsMessage';
import UserFilter from '../presenters/UserFilter';
import UserList from '../presenters/UserList';
import { Group, Label, Field } from '../presenters/HorizontalForm';

export default {

  components: {
    Button,
    Field,
    Group,
    Label,
    NoItemsMessage,
    UserFilter,
    UserList,
  },

  props: {
    initialValues: {
      type: Object,
      default: () => ({
        title: '',
        userIds: [],
      }),
    },
    userIds: {
      type: Array,
    },
  },

  inject: ['server'],

  data() {
    return {
      fields: this.initialValues || {
        title: '',
        userIds: [],
      },

      isFetching: false,
      isFetched: false,

      filter: {},
      users: [],
    };
  },

  computed: {
    hasAnyUsers() {
      return this.users.length > 0;
    },
  },

  watch: {
    initialValues(initialValues) {
      this.fields = {
        title: initialValues.title,
        userIds: initialValues.userIds.slice(),
      };
    },
  },

  async mounted() {
    this.isFetching = true;

    try {
      this.users = await this.server.send('users/index');
    } catch (err) {
      console.error(err);
      alert(err);
    }

    this.isFetching = false;
    this.isFetched = true;
  },

  methods: {
    handleSubmit() {
      const formData = {
        title: this.fields.title,
        userIds: this.fields.userIds.slice(),
      };

      this.$emit('submit', formData);
    },

    handleFilterChange(filter) {
      this.filter = filter;
    },

    handleFilterReset() {
      this.filter = {};
    },

    toggleSelection(selectedUser) {
      if (this.isSelected(selectedUser)) {
        this.fields.userIds = this.fields.userIds.filter((id) => {
          return id !== selectedUser.id;
        });
      } else {
        this.fields.userIds.push(selectedUser.id);
      }
    },

    isSelected(user) {
      return this.fields.userIds.includes(user.id);
    },

  },

};
</script>

<style module>
.input {
  border: 1px solid #d3d9de;
  border-radius: 2px;
  color: #000;
  margin: 0;
  padding: 3px 5px;
}

.users {
  display: flex;
}

.list {
  height: 600px;
  overflow-y: auto;
  flex: 0.7;
}

.filter {
  border-left: 1px solid #e7e8ec;
  flex: 0.3;
  margin-left: 20px;
  padding-left: 20px;
}
</style>
