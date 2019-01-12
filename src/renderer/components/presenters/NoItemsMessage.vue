<template>
  <div :class="$style.message">
    <slot>
      {{$t('noItems')}}
    </slot>
  </div>
</template>

<script>
export default {

  i18n: {
    messages: {
      en: {
        noItems: 'No items',
      },
      ru: {
        noItems: 'Нет данных',
      },
    },
  },

};
</script>

<style module>
.message {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
