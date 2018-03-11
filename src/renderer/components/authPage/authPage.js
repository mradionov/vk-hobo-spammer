(() => {
  class AuthPage extends window.vhs.lib.EventEmitter {
    constructor() {
      super();

      this.$page = document.querySelector('[data-auth-page]');
      this.$authorizeButton = document.querySelector('[data-auth-page-authorize]');

      this.onAuthorizeButtonClick = this.onAuthorizeButtonClick.bind(this);
    }

    open() {
      this.$page.classList.remove('hidden');
      this.$authorizeButton.addEventListener('click', this.onAuthorizeButtonClick);
    }

    close() {
      this.$page.classList.add('hidden');
      this.$authorizeButton.removeEventListener('click', this.onAuthorizeButtonClick);
    }

    onAuthorizeButtonClick() {
      this.emit('authorize');
    }
  }

  window.vhs.components.authPage = new AuthPage();
})();
