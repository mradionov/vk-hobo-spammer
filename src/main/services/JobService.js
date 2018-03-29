const fs = require('../lib/fs');

class JobService {
  constructor(options = { indexPath: '' }) {
    this.options = options;
  }

  async create(data) {
    const jobs = await this.getIndex();

    const lastJob = jobs[jobs.length - 1];
    const lastJobId = lastJob.id || 0;
    const nextJobId = lastJobId + 1;

    const job = data;
    job.id = nextJobId;
    job.createdAt = Date.now();

    jobs.push(job);

    await this.saveIndex(jobs);

    return job;
  }

  async update(jobId, data) {
    const jobs = await this.getIndex();

    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }

    const foundJob = jobs[jobIndex];
    const updatedJob = Object.assign({}, foundJob, data, { id: jobId });

    jobs.splice(jobIndex, 1, updatedJob);

    await this.saveIndex(jobs);

    return updatedJob;
  }

  async remove(jobId) {
    const jobs = await this.getIndex();

    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }

    jobs.splice(jobIndex, 1);

    await this.saveIndex(jobs);
  }

  async get(jobId) {
    const jobs = await this.getIndex();
    const foundJob = jobs.find(job => job.id === jobId);
    if (foundJob === undefined) {
      throw new Error('Job not found');
    }
    return foundJob;
  }

  async getIndex() {
    let jobs = [];
    try {
      jobs = await fs.readJSON(this.options.indexPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // It's fine if file does not exist yet. It will be created with the
        // first added job.
      } else {
        throw err;
      }
    }
    return jobs;
  }

  async saveIndex(jobs) {
    return fs.writeJSON(this.options.indexPath, jobs);
  }
}

module.exports = JobService;
