(() => {
  class Header extends window.vhs.lib.EventEmitter {
    constructor() {
      super();

      this.$profileContainer = document.querySelector('[data-header-profile]');
      this.$name = document.querySelector('[data-header-profile-name]');
      this.$photo = document.querySelector('[data-header-profile-photo]');
      this.$logoutButton = document.querySelector('[data-header-profile-logout]');

      this.onLogoutButtonClick = this.onLogoutButtonClick.bind(this);
    }

    login(profile) {
      this.$photo.src = profile.photo_50;
      this.$name.textContent = `${profile.first_name} ${profile.last_name}`;
      this.$logoutButton.addEventListener('click', this.onLogoutButtonClick);
      this.$profileContainer.classList.remove('hidden');
    }

    logout() {
      this.$profileContainer.classList.add('hidden');
      this.$logoutButton.removeEventListener('click', this.onLogoutButtonClick);
    }

    onLogoutButtonClick() {
      this.emit('logout');
    }
  }

  window.vhs = window.vhs || {};
  window.vhs.components = window.vhs.components || {};
  window.vhs.components.header = new Header();
})();
