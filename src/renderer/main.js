const electron = require('electron');

const $friendList = document.querySelector('[data-friend-list]');
const $sendList = document.querySelector('[data-send-list]');
const $messageInput = document.querySelector('[data-message-text]');
const $randomInput = document.querySelector('[data-random]');
const $sendButton = document.querySelector('[data-send]');
const $resetButton = document.querySelector('[data-reset]');
const $addAllButton = document.querySelector('[data-add-all]');

const request = new window.vhs.lib.Request({
  base: 'https://api.vk.com/method',
  params: {
    v: '5.73',
  },
});

const api = new window.vhs.lib.VKApi(request);

electron.ipcRenderer.send('hobo:ready');

electron.ipcRenderer.on('hobo:auth/login/guest', () => {
  window.vhs.components.authPage.open();
});

electron.ipcRenderer.on('hobo:auth/login/success', async (ev, token) => {
  request.appendParams({
    access_token: token,
  });

  try {
    const profile = await api.getProfile();
    window.vhs.components.header.login(profile);
  } catch (err) {
    if (err.error_code === window.vhs.lib.VKApi.TOKEN_ERROR) {
      alert(err.error_msg);
      electron.ipcRenderer.send('hobo:auth/logout/request');
    }

    throw err;
  }

  window.vhs.components.authPage.close();
  window.vhs.components.jobPage.open();

  const friends = await api.getFriends();
  while ($friendList.firstChild) {
    $friendList.removeChild($friendList.firstChild);
  }
  $friendList.removeEventListener('click', handleFriendListItemClick);
  $friendList.addEventListener('click', handleFriendListItemClick);
  $sendList.removeEventListener('click', handleSendListItemClick);
  $sendList.addEventListener('click', handleSendListItemClick);
  friends.forEach((friend) => {
    const $item = document.createElement('li');
    $item.dataset.id = friend.id;
    $item.textContent = `${friend.id}: ${friend.first_name} ${friend.last_name}`;
    $friendList.appendChild($item);
  });
});

electron.ipcRenderer.on('hobo:auth/login/failure', (ev, err) => {
  window.alert(err.error_description);
});

electron.ipcRenderer.on('hobo:auth/logout/success', () => {
  window.vhs.components.header.logout();
  window.vhs.components.authPage.open();
  window.vhs.components.jobPage.close();
});

window.vhs.components.header.on('logout', () => {
  electron.ipcRenderer.send('hobo:auth/logout/request');
});

window.vhs.components.authPage.on('authorize', () => {
  electron.ipcRenderer.send('hobo:auth/login/request');
});

function beforeSend() {
  $resetButton.disabled = true;
  $sendButton.disabled = true;
  $sendButton.textContent = 'Sending ...';
  $friendList.removeEventListener('click', handleFriendListItemClick);
  $sendList.removeEventListener('click', handleSendListItemClick);
}

function afterSend() {
  $resetButton.disabled = false;
  $sendButton.disabled = false;
  $sendButton.textContent = 'Send';
  $friendList.addEventListener('click', handleFriendListItemClick);
  $sendList.addEventListener('click', handleSendListItemClick);
}

$sendButton.addEventListener('click', async () => {
  beforeSend();

  const text = $messageInput.value;
  if (text.trim().length === 0) {
    alert('Must have some text');
    afterSend();
    return;
  }

  const randomId = $randomInput.value;
  if (randomId.trim().length === 0) {
    alert('Must have random id');
    afterSend();
    return;
  }

  if (!Number(randomId)) {
    alert('Random id must be a number');
    afterSend();
    return;
  }

  const items = Array.from($sendList.children);
  if (items.length === 0) {
    alert('You must have at least one recepient');
    afterSend();
    return;
  }

  for (let $item of items) {
    $item.classList.add('is-sending');

    const peerId = $item.dataset.id;
    const totalRandomId = peerId + randomId;
    const text = $messageInput.value;

    try {
      const result = await api.sendMessage(peerId, totalRandomId, text);
      $item.classList.remove('is-sending');
      $item.classList.add('is-sent');
    } catch (err) {
      $item.classList.add('is-failed');
      $item.title = err.error_msg;

      console.log(err);
    }

    await delay(1000);
  };

  alert('All messages succesfully sent');

  afterSend();
});

$resetButton.addEventListener('click', () => {
  const items = Array.from($sendList.children);
  items.forEach(($item) => {
    $item.classList.remove('is-sending', 'is-sent', 'is-failed');

    $friendList.appendChild($item);
  });
  $messageInput.value = '';
  $randomInput.value = '1';
});

$addAllButton.addEventListener('click', () => {
  const items = Array.from($friendList.children);
  items.forEach(($item) => {
    $sendList.appendChild($item);
  });
});

function handleFriendListItemClick(ev) {
  const $item = ev.target;
  if ($item.dataset.id === undefined) return;

  $sendList.appendChild($item);
}

function handleSendListItemClick(ev) {
  const $item = ev.target;
  if ($item.dataset.id === undefined) return;

  $friendList.appendChild($item);
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
