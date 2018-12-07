<template>
  <router-link
    :class="$style.container"
    :to="to"
  >
    <slot />
  </router-link>
</template>

<script>
export default {

  props: {
    to: {
      type: [String, Object],
      default: '',
    },
  },

};
</script>

<style module>
.container {
  color: #fff;
  background: #5181b8;
  border: 0;
  border-radius: 4px;
  padding: 7px 16px 8px;
  text-decoration: none;
}

.container:hover {
  background: #5b88bd;
  cursor: pointer;
}

.container[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.container + .container {
  margin-left: 10px;
}
</style>
