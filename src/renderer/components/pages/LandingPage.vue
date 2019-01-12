<template>
  <div>
    {{$t('loading')}}
  </div>
</template>

<script>
export default {

  i18n: {
    messages: {
      en: {
        loading: 'Loading...',
      },
      ru: {
        loading: 'Загрузка...',
      },
    },
  },

};
</script>
