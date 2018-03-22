<template>
  <button
    class="container"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.container {
  color: #fff;
  background: #5181b8;
  border: 0;
  border-radius: 4px;
  padding: 7px 16px 8px;
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
