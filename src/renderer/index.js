const electron = require('electron');

const $authPage = document.querySelector('[data-page="auth"]');
const $friendPage = document.querySelector('[data-page="friend"]');
const $friendList = document.querySelector('[data-friend-list]');
const $loader = document.querySelector('[data-loader]');
const $authorizeButton = document.querySelector('[data-authorize]');

electron.ipcRenderer.send('hobo:ready');

electron.ipcRenderer.on('hobo:token', (ev, token) => {
  $loader.classList.add('hidden');

  if (token === undefined) {
    openAuthPage();
    return;
  }

  openFriendPage(token);
});

$authorizeButton.addEventListener('click', () => {
  electron.ipcRenderer.send('hobo:authorize');
  $loader.classList.remove('hidden');
});

function openAuthPage() {
  $authPage.classList.remove('hidden');
}

async function openFriendPage(token) {
  $authPage.classList.add('hidden');
  $friendPage.classList.remove('hidden');

  const url = `https://api.vk.com/method/friends.get?v=5.73&access_token=${token}&fields=first_name,last_name`;
  const response = await fetch(url);
  const data = await response.json();
  const friends = data.response.items;

  friends.forEach((friend) => {
    const $item = document.createElement('li');
    $item.textContent = `${friend.id}: ${friend.first_name} ${friend.last_name}`;
    $friendList.appendChild($item);
  });
}
