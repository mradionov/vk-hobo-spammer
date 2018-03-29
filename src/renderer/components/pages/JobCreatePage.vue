<template>
  <div>
    <PageTitle>
      Create Job
      <div slot="actions">
        <BackButton />
      </div>
    </PageTitle>
    <JobForm
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import BackButton from '../basic/BackButton';
import Button from '../basic/Button';
import JobForm from '../forms/JobForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    BackButton,
    Button,
    JobForm,
    PageTitle,
  },

  methods: {

    onSubmit(data) {
      ipcRenderer.send('app:jobs/create/request', data);
      ipcRenderer.once('app:jobs/create/success', () => {
        this.$router.push('/jobs');
      });
      ipcRenderer.once('app:jobs/create/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>

<style module>

</style>
