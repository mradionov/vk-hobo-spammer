<template>
  <th :class="$style.cell">
    <slot />
  </th>
</template>

<style module>
.cell {
  background: #fff;
  padding: 5px 10px;
  position: sticky;
  top: 0;
}
</style>
