(() => {
  class JobPage extends window.vhs.lib.EventEmitter {
    constructor() {
      super();

      this.$page = document.querySelector('[data-job-page]');
    }

    open() {
      this.$page.classList.remove('hidden');
    }

    close() {
      this.$page.classList.add('hidden');
    }
  }

  window.vhs.components.jobPage = new JobPage();
})();
