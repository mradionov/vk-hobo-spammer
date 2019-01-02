<template>
  <div :class="$style.group">
    <slot />
  </div>
</template>

<style module>
.group {
  display: flex;
}
</style>
