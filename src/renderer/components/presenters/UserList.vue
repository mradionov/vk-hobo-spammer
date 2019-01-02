<template>
  <Table>
    <HeaderRow slot="header">
      <HeaderCell>
        Selected
        ({{selectedCount}} / {{totalCount}})
      </HeaderCell>
      <HeaderCell>Photo</HeaderCell>
      <HeaderCell>ID</HeaderCell>
      <HeaderCell>Name</HeaderCell>
      <HeaderCell>City</HeaderCell>
    </HeaderRow>
    <HeaderRow
      slot="header"
      v-if="isFilterActive"
    >
      <HeaderCell
        colspan="5"
        :class="$style.filteredCell"
      >
        Showing filtered results {{filteredCount}} / {{totalCount}}
      </HeaderCell>
    </HeaderRow>
    <Row
      v-for="user in filteredUsers"
      :class="[
        $style.row,
        isSelected(user) && $style.selected,
      ]"
      :key="user.id"
      @click.native="select(user)"
    >
      <Cell :class="$style.selectionCell">
        <Checkbox
          :checked="isSelected(user)"
        />
      </Cell>
      <Cell :class="$style.photoCell">
        <img
          :class="$style.photo"
          :src="user.photo_50"
        />
      </Cell>
      <Cell :class="$style.idCell">
        {{user.id}}
      </Cell>
      <Cell :class="$style.nameCell">
        {{user.first_name}} {{user.last_name}}
      </Cell>
      <Cell>
        {{user.city && user.city.title}}
      </Cell>
    </Row>
  </Table>
</template>

<script>
import Checkbox from '../presenters/Checkbox';
import { Table, HeaderRow, HeaderCell, Row, Cell } from '../presenters/Table';

export default {

  components: {
    Cell,
    Checkbox,
    HeaderCell,
    HeaderRow,
    Row,
    Table,
  },

  props: {
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
      this.$emit('select', user);
    },

    isSelected(user) {
      return this.selected.includes(user.id);
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
  background: #e1e5eb;
  cursor: pointer;
}

.row.selected {
  background: #cbefd3;
}

.row.selected:hover {
  background: #bce0c4;
}
</style>
