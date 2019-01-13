<template>
  <form ref="form">
    <Group>
      <Label>{{$t('title')}}</Label>
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
      <Label>{{$t('users')}}</Label>
      <Field>
        <div :class="$style.users">
          <div :class="$style.list">
            <UserList
              v-if="hasAnyUsers"
              :bundleId="bundleId"
              :filterByName="filter.name"
              :selected="fields.userIds"
              :users="users"
              @select="toggleSelection"
            />
            <NoItemsMessage v-if="isFetching">
              {{$t('loading')}}
            </NoItemsMessage>
            <NoItemsMessage v-if="isFetched && !hasAnyUsers">
              {{$t('noItems')}}
            </NoItemsMessage>
          </div>
          <div :class="$style.filter">
            <h3>{{$t('filter')}}</h3>
            <UserFilter
              @change="handleFilterChange"
              @reset="handleFilterReset"
            />
          </div>
        </div>
      </Field>
    </Group>
  </form>
</template>

<script>
import NoItemsMessage from '../presenters/NoItemsMessage';
import UserFilter from '../presenters/UserFilter';
import UserList from '../presenters/UserList';
import { Group, Label, Field } from '../presenters/HorizontalForm';

export default {

  components: {
    Field,
    Group,
    Label,
    NoItemsMessage,
    UserFilter,
    UserList,
  },

  props: {
    bundleId: {
      type: String,
      default: null,
    },
    initialValues: {
      type: Object,
      default: () => ({
        title: '',
        userIds: [],
      }),
    },
    users: {
      type: Array,
      default: () => [],
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

  methods: {
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

    requestSubmit() {
      const form = this.$refs.form;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const userIds = this.fields.userIds.slice();
      const users = this.users.filter((user) => {
        return userIds.includes(user.id);
      });

      const formData = {
        title: this.fields.title,
        userIds,
        users,
      };

      this.$emit('submit', formData);
    },

  },

  i18n: {
    messages: {
      en: {
        title: 'Title',
        users: 'Users',
        loading: 'Loading ...',
        noItems: 'No friends :(',
        filter: 'Filter',
        save: 'Save',
      },
      ru: {
        title: 'Название',
        users: 'Пользователи',
        loading: 'Загрузка ...',
        noItems: 'Нет друзей :(',
        filter: 'Фильтр',
        save: 'Сохранить',
      },
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
