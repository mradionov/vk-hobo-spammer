<template>
  <div :class="$style.container">
    <h2 :class="$style.title">
      <slot />
    </h2>
    <div :class="$style.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style module>
.container {
  border-bottom: 1px solid #e7e8ec;
  display: flex;
  height: 42px;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.title {
  display: inline-block;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.actions {
  align-items: center;
  display: flex;
}
</style>
