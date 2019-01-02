<template>
  <div :class="$style.label">
    <slot />
  </div>
</template>

<style module>
.label {
  color: #656565;
  padding: 6px 12px 7px 0;
}
</style>
