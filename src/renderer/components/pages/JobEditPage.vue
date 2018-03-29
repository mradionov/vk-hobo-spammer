<template>
  <div>
    <PageTitle>
      Edit Job
      <div slot="actions">
        <BackButton />
      </div>
    </PageTitle>
    <JobForm
      :initialValues="job"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import BackButton from '../basic/BackButton';
import JobForm from '../forms/JobForm';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    BackButton,
    JobForm,
    PageTitle,
  },

  data() {
    return {
      job: null,
    };
  },

  async mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      ipcRenderer.send('app:jobs/get/request', this.$route.params.jobId);
      ipcRenderer.once('app:jobs/get/success', (ev, job) => {
        this.job = job;
      });
    },

    onSubmit(data) {
      ipcRenderer.send('app:jobs/update/request', data.id, data);
      ipcRenderer.once('app:jobs/update/success', () => {
        this.$router.push('/jobs');
      });
      ipcRenderer.once('app:jobs/update/failure', (ev, err) => {
        console.error(err);
      });
    },

  },

};
</script>

<style module>

</style>
