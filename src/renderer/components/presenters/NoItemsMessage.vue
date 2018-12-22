<template>
  <div :class="$style.message">
    <slot>
      No items
    </slot>
  </div>
</template>

<style module>
.message {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
