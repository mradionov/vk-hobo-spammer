<template>
  <div :class="$style.field">
    <slot />
  </div>
</template>

<style module>
.field {
  flex: 1;
}
</style>
