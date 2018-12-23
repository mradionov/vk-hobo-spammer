<template>
  <table :class="$style.table">
    <thead>
      <slot name="header" />
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<style module>
.table {
  border-collapse: collapse;
  text-align: left;
  width: 100%;
}
</style>
