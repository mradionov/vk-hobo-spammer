<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>
        {{$t('selected')}}
        ({{selectedCount}} / {{totalCount}})
      </HeaderCell>
      <HeaderCell>{{$t('photo')}}</HeaderCell>
      <HeaderCell>{{$t('id')}}</HeaderCell>
      <HeaderCell>{{$t('name')}}</HeaderCell>
      <HeaderCell>{{$t('city')}}</HeaderCell>
      <HeaderCell>{{$t('status')}}</HeaderCell>
    </HeaderRow>
    <HeaderRow
      slot="header"
      v-if="isFilterActive"
    >
      <HeaderCell
        colspan="6"
        :class="$style.filteredCell"
      >
        {{$t('filter')}} {{filteredCount}} / {{totalCount}}
      </HeaderCell>
    </HeaderRow>
    <Row
      v-for="user in filteredUsers"
      :class="[
        $style.row,
        isNew(user) && $style.isNew,
        isKept(user) && $style.isKept,
        isRemoved(user) && $style.isRemoved,
        isDisabled(user) && $style.isDisabled,
      ]"
      :key="user.id"
      @click.native="select(user)"
    >
      <Cell :class="[$style.cell, $style.selectionCell]">
        <Checkbox
          :checked="isSelected(user)"
        />
      </Cell>
      <Cell :class="[$style.cell, $style.photoCell]">
        <img
          :class="$style.photo"
          :src="user.photo_50"
        />
      </Cell>
      <Cell :class="[$style.cell, $style.idCell]">
        {{user.id}}
      </Cell>
      <Cell :class="[$style.cell, $style.nameCell]">
        {{user.first_name}} {{user.last_name}}
      </Cell>
      <Cell :class="[$style.cell]" >
        {{user.city && user.city.title}}
      </Cell>
      <Cell :class="$style.statusCell">
        <StatusText
          :status="user.post && user.post.status"
        />
      </Cell>
    </Row>
  </Table>
</template>

<script>
import Checkbox from '../presenters/Checkbox';
import StatusText from '../presenters/StatusText';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

import { POST_STATUSES } from '~/constants/post';

export default {

  components: {
    Cell,
    Checkbox,
    HeaderCell,
    HeaderRow,
    Row,
    StatusText,
    Table,
  },

  props: {
    bundleId: {
      type: String,
      default: null,
    },
    filterByName: {
      type: String,
      default: () => '',
    },
    selected: {
      type: Array,
      default: () => [],
    },
    users: Array,
  },

  computed: {
    isFilterByNameActive() {
      return this.filterByName && this.filterByName.trim().length > 0;
    },
    filteredUsers() {
      if (!this.isFilterByNameActive) {
        return this.users;
      }

      const filterByName = this.filterByName.trim();

      const filteredUsers = this.users.filter((user) => {
        const name = `${user.first_name} ${user.last_name}`;

        const lcName = name.toLowerCase();
        const lcFilter = filterByName.toLowerCase();

        return lcName.includes(lcFilter);
      });

      return filteredUsers;
    },
    isFilterActive() {
      return this.isFilterByNameActive;
    },
    filteredCount() {
      return this.filteredUsers.length;
    },
    selectedCount() {
      return this.selected.length;
    },
    totalCount() {
      return this.users.length;
    },
  },

  methods: {

    select(user) {
      if (this.isDisabled(user)) {
        return;
      }

      this.$emit('select', user);
    },

    isSelected(user) {
      return this.isNew(user) || this.isKept(user);
    },

    isNew(user) {
      if (user.post) {
        return false;
      }
      return this.selected.includes(user.id);
    },

    isKept(user) {
      if (this.isDisabled(user)) {
        return false;
      }
      if (!user.post) {
        return false;
      }
      if (user.post.bundleId !== this.bundleId) {
        return false;
      }
      return this.selected.includes(user.id);
    },

    isRemoved(user) {
      if (this.isDisabled(user)) {
        return false;
      }
      if (!user.post) {
        return false;
      }
      if (user.post.bundleId !== this.bundleId) {
        return false;
      }
      return !this.isSelected(user);
    },

    isDisabled(user) {
      if (!user.post) {
        return false;
      }

      const { bundleId, status } = user.post;

      if (bundleId === this.bundleId) {
        if (status === POST_STATUSES.idle || status === POST_STATUSES.failed) {
          return false;
        }
      }

      return true;
    },

  },

  i18n: {
    messages: {
      en: {
        selected: 'Selected',
        photo: 'Photo',
        id: 'ID',
        name: 'Name',
        city: 'City',
        status: 'Status',
        filter: 'Showing filtered results',
      },
      ru: {
        selected: 'Выбрано',
        photo: 'Фото',
        id: 'ID',
        name: 'Имя',
        city: 'Город',
        status: 'Статус',
        filter: 'Показаны отфильтрованные результаты',
      },
    },
  },

};
</script>

<style module>
.filteredCell {
  background: #f3f3f3;
  font-weight: normal;
  font-style: italic;
  text-align: center;
  top: 25px;
}

.selectionCell {
  width: 150px;
}

.statusCell {
  width: 80px;
}

.idCell {
  width: 150px;
}

.photoCell {
  width: 100px;
}

.photo {
  width: 30px;
}

.nameCell {
  width: 250px;
}

.row:hover {
  background: #f7f7f7;
  cursor: pointer;
}

.row.isNew {
  background: #e4ffea;
}

.row.isNew:hover {
  background: #d9f5df;
}

.row.isKept {
  background: #dff7ff;
}

.row.isKept:hover {
  background: #d6f0f9;
}

.row.isRemoved {
  background: #ffefef;
}

.row.isRemoved:hover {
  background: #f7e4e4;
}

.row.isDisabled .cell,
.row.isDisabled .cell:hover {
  cursor: not-allowed;
  background: #ddd;
  opacity: 0.15;
}

.row.isDisabled:hover {
  background: none;
}

.row.isDisabled .statusCell {
  cursor: not-allowed;
  background: rgba(204, 204, 204, 0.15);
}
</style>
