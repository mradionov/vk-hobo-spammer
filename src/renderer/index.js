const electron = require('electron');

const $friendList = document.querySelector('[data-friend-list]');
const $messageInput = document.querySelector('[data-message-text]');
const $messageSendButton = document.querySelector('[data-message-send]');

let accessToken;

electron.ipcRenderer.send('hobo:ready');

electron.ipcRenderer.on('hobo:auth/login/guest', () => {
  window.vhs.components.authPage.open();
});

electron.ipcRenderer.on('hobo:auth/login/success', async (ev, token) => {
  accessToken = token;

  const profile = await getProfile();
  window.vhs.components.header.login(profile);

  window.vhs.components.authPage.close();
  window.vhs.components.friendPage.open();

  await getFriends();
});

electron.ipcRenderer.on('hobo:auth/login/failure', (ev, err) => {
  window.alert(err.error_description);
});

electron.ipcRenderer.on('hobo:auth/logout/success', () => {
  window.vhs.components.header.logout();
  window.vhs.components.authPage.open();
  window.vhs.components.friendPage.close();
});

window.vhs.components.header.on('logout', () => {
  electron.ipcRenderer.send('hobo:auth/logout/request');
});

window.vhs.components.authPage.on('authorize', () => {
  electron.ipcRenderer.send('hobo:auth/login/request');
});

async function getProfile() {
  const url = `https://api.vk.com/method/users.get?v=5.73&access_token=${accessToken}&fields=first_name,last_name,photo_50`;
  const response = await fetch(url);
  const data = await response.json();
  const users = data.response;
  const profile = users[0];

  return profile;
}

async function getFriends() {
  const url = `https://api.vk.com/method/friends.get?v=5.73&access_token=${accessToken}&fields=first_name,last_name`;
  const response = await fetch(url);
  const data = await response.json();
  const friends = data.response.items;

  friends.forEach((friend) => {
    const $item = document.createElement('li');
    $item.textContent = `${friend.id}: ${friend.first_name} ${friend.last_name}`;
    $friendList.appendChild($item);
  });
}

$messageSendButton.addEventListener('click', async () => {
  const text = $messageInput.value;

  const url = `https://api.vk.com/method/messages.send?v=5.73&access_token=${accessToken}&peer_id=264758493&random_id=1&message=${text}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    const error = data.error;
    window.alert(`Error: ${error.error_msg}`);
    return;
  }

  console.log({ response, data });

});
