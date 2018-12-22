<template>
  <tr :class="$style.row">
    <slot />
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid #e7e8ec;
}
</style>
