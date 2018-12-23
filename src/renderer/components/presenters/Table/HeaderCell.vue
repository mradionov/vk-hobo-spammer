<template>
  <th :class="$style.cell">
    <slot />
  </th>
</template>

<style module>
.cell {
  padding: 5px 10px;
}
</style>
