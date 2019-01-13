<template>
  <Section>
    <PageTitle>
      {{$t('title')}}
    </PageTitle>
  </Section>
</template>

<script>
import PageTitle from '../presenters/PageTitle';
import Section from '../presenters/Section';

export default {

  components: {
    PageTitle,
    Section,
  },

  i18n: {
    messages: {
      en: {
        title: 'Progress',
      },
      ru: {
        title: 'Прогресс',
      },
    },
  },

};
</script>

<style module>

</style>
