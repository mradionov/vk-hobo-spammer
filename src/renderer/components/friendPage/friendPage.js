class FriendPage extends window.vhs.lib.EventEmitter {
  constructor() {
    super();

    this.$page = document.querySelector('[data-friend-page]');
  }

  open() {
    this.$page.classList.remove('hidden');
  }

  close() {
    this.$page.classList.add('hidden');
  }
}

window.vhs = window.vhs || {};
window.vhs.components = window.vhs.components || {};
window.vhs.components.friendPage = new FriendPage();
