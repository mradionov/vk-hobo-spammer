<template>
  <ul class="list">
    <li
      class="item"
      v-for="user in users"
      @click="onItemClick(user)"
    >
      <span class="id">
        {{user.id}}
      </span>
      {{user.first_name}} {{user.last_name}}
    </li>
  </ul>
</template>

<script>
export default {

  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onItemClick(user) {
      this.$emit('select', user);
    },
  },

};
</script>

<style scoped>
.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.item {
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 8px;
}

.item:hover {
  background: #8ac176;
}

.id {
  display: inline-block;
  width: 80px;
}
</style>
