<template>
  <div>
    <PageTitle>
      Jobs
      <ButtonLink
        slot="actions"
        to="/jobs/create"
      >
        Create
      </ButtonLink>
    </PageTitle>
    <table
      :class="$style.table"
      v-if="hasJobs"
    >
      <thead>
        <tr :class="$style.row">
          <th :class="$style.idCell">
            ID
          </th>
          <th>
            Title
          </th>
          <th>
            Created at
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :class="$style.row"
          v-for="job in jobs"
        >
          <td>{{job.id}}</td>
          <td>{{job.title}}</td>
          <td>{{job.createdAt | date}}</td>
          <td>
            <ButtonLink :to="{ name: 'jobsEdit', params: { jobId: job.id } }">
              Edit
            </ButtonLink>
            <Button @click="onRemove(job)">
              Remove
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
    <div :class="$style.empty" v-if="!hasJobs">
      No jobs yet
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import Button from '../basic/Button';
import ButtonLink from '../basic/ButtonLink';
import PageTitle from '../presenters/PageTitle';

export default {

  components: {
    Button,
    ButtonLink,
    PageTitle,
  },

  filters: {
    date(value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleString('ru-RU');
      return formattedDate;
    },
  },

  data() {
    return {
      jobs: [],
    };
  },

  computed: {
    hasJobs() {
      return this.jobs.length > 0;
    },
  },

  async mounted() {
    this.fetch();
  },

  methods: {

    fetch() {
      ipcRenderer.send('app:jobs/index/request');
      ipcRenderer.once('app:jobs/index/success', (ev, jobs) => {
        this.jobs = jobs;
      });
    },

    onRemove(job) {
      const isRemoveConfirmed = window.confirm('Are you sure?');
      if (!isRemoveConfirmed) {
        return;
      }

      ipcRenderer.send('app:jobs/remove/request', job.id);
      ipcRenderer.once('app:jobs/remove/success', () => {
        this.fetch();
      });
    },

  },

};
</script>

<style module>
.table {
  text-align: left;
  width: 100%;
}

.row {
  border-bottom: 1px solid #e7e8ec;
}

.idCell {
  width: 40px;
}

.empty {
  color: #818d99;
  font-size: 18px;
  text-align: center;
}
</style>
