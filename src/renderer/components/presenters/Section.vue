<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<style module>
.container {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;
  margin: 10px 20px 20px 20px;
  padding: 20px;
}
</style>
