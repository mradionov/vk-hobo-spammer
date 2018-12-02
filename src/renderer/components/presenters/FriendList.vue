<template>
  <div>
    <h3>Friends</h3>
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
  </div>
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
  padding: 0 20px 0 0;
  height: 300px;
  overflow-y: auto;
}

.item {
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 8px 4px 0;
}

.item:hover {
  background: #8ac176;
}

.id {
  display: inline-block;
  width: 80px;
}
</style>
