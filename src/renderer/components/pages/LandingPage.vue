<template>
  <Section>
    {{$t('loading')}}
  </Section>
</template>

<script>
import Section from '../presenters/Section';

export default {

  components: {
    Section,
  },

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
