<template>
  <div>
    <PageTitle>
      Posts
      <div slot="actions">
        <BackButton />
      </div>
    </PageTitle>
  </div>
</template>

<script>
import BackButton from '../basic/BackButton';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    BackButton,
    PageTitle,
  },

};
</script>
