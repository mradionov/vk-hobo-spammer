<template>
  <div :class="$style.label">
    <slot />
  </div>
</template>

<style module>
.label {
  color: #656565;
  text-align: right;
  padding: 6px 12px 7px 0;
  width: 100px;
}
</style>
