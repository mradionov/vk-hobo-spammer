const { app, BrowserWindow } = require('electron');
const rmdir = require('rimraf');

const MessagesStore = require('./db/MessagesStore');
const BundlesStore = require('./db/BundlesStore');
const PostsStore = require('./db/PostsStore');

const IPCRouterServer = require('./services/IPCRouterServer');
const PostSender = require('./services/PostSender');
const VKApi = require('./services/VKApi');
const VKAuthService = require('./services/VKAuthService');

const ApplicationMenu = require('./menu/ApplicationMenu');

const Cache = require('./lib/Cache');

const { isDev } = require('./config/env');
const {
  APP_PATH,
  CACHE_GENERAL_PATH, CACHE_QUEUE_PATH,
  DB_MESSAGES_PATH, DB_BUNDLES_PATH, DB_POSTS_PATH,
} = require('./config/paths');

const { VK_APP_ID } = require('./config/secrets');
const { LOCALES } = require('./constants/locale');

const cache = new Cache({ path: CACHE_GENERAL_PATH });
// Keep queue cache separate from the rest of the cache to avoid errors
// in case of consequent I/O
const queueCache = new Cache({ path: CACHE_QUEUE_PATH });

const vkAuthService = new VKAuthService({ appId: VK_APP_ID });
const router = new IPCRouterServer();

const vkApi = new VKApi({
  accessTokenFactory: () => cache.get('accessToken'),
});

const messagesStore = new MessagesStore(DB_MESSAGES_PATH);
const bundlesStore = new BundlesStore(DB_BUNDLES_PATH);
const postsStore = new PostsStore(DB_POSTS_PATH);

const db = {
  messages: messagesStore,
  bundles: bundlesStore,
  posts: postsStore,
};

const postSender = new PostSender(queueCache, db, vkApi);

let window;

const handleDataReset = () => {
  rmdir(APP_PATH, (err) => {
    if (err) {
      console.error(err);
    }
    app.quit();
  });
};

app.on('ready', async () => {
  await cache.load();
  await queueCache.load();
  await postSender.init();

  const url = `file://${__dirname}/renderer/index.html`;
  window = new BrowserWindow();
  window.loadURL(url);
  window.maximize();

  if (isDev()) {
    window.webContents.openDevTools();
  }

  router.setWindow(window);


  let initialLocale = cache.get('locale');
  if (initialLocale === undefined) {
    const appLocale = app.getLocale();
    if (appLocale === 'ru-RU') {
      initialLocale = LOCALES.ru;
    } else {
      initialLocale = LOCALES.en;
    }
  }

  const menu = new ApplicationMenu(initialLocale, handleDataReset);

  menu.on('change', async (locale) => {
    router.notify('locale/update');
    cache.set('locale', locale);
    await cache.save();
  });
});

postSender.on('update', () => {
  router.notify('sender/update');
});

router.route('auth/login', async (req, res) => {
  try {
    const token = await vkAuthService.authorize();
    cache.set('accessToken', token);
    await cache.save();

    res.send();
  } catch (err) {
    res.fail(err);
  }
});

router.route('auth/logout', async (req, res) => {
  cache.remove('accessToken');
  await cache.save();
  res.send();
});

router.route('locale', async (req, res) => {
  let initialLocale = cache.get('locale');
  if (initialLocale === undefined) {
    const appLocale = app.getLocale();
    if (appLocale === 'ru-RU') {
      initialLocale = LOCALES.ru;
    } else {
      initialLocale = LOCALES.en;
    }
  }

  res.send(initialLocale);
});

router.route('profile', async (req, res) => {
  try {
    const profile = await vkApi.getProfile();
    res.send(profile);
  } catch (err) {
    res.fail(err);
  }
});

router.route('messages/new', async (req, res) => {
  const messageData = {
    title: '',
    text: '',
    attachments: [],
  };

  res.send(messageData);
});

router.route('messages/create', async (req, res) => {
  try {
    const nextRandomId = (cache.get('randomId') || 0) + 1;

    const messageData = {
      ...req.data,
      randomId: nextRandomId,
    };

    const newMessage = await messagesStore.create(messageData);

    cache.set('randomId', nextRandomId);
    await cache.save();

    res.send(newMessage);
  } catch (err) {
    res.fail(err);
  }
});

router.route('messages/index', async (req, res) => {
  try {
    const messages = await messagesStore.findAll();
    res.send(messages);
  } catch (err) {
    res.fail(err);
  }
});

router.route('messages/show', async (req, res) => {
  try {
    const message = await messagesStore.findById(req.data.id);
    res.send(message);
  } catch (err) {
    res.fail(err);
  }
});

router.route('messages/update', async (req, res) => {
  try {
    const message = await messagesStore.updateById(req.data._id, req.data);
    res.send(message);
  } catch (err) {
    res.fail(err);
  }
});

router.route('messages/remove', async (req, res) => {
  const messageId = req.data.id;

  try {
    await messagesStore.removeById(messageId);

    const bundles = await bundlesStore.findAllByMessage(messageId);
    const bundleIds = bundles.map(bundle => bundle._id);

    await postsStore.removeAllByBundles(bundleIds);

    await bundlesStore.removeAllByMessage(messageId);

    res.send();
  } catch (err) {
    res.fail(err);
  }
});

router.route('bundles/index', async (req, res) => {
  try {
    const bundles = await bundlesStore.findAllByMessage(req.data.messageId);

    const bundlesWithStats = [];

    for (const bundle of bundles) {
      const waitingPostsCount = await postsStore.countWaitingByBundle(bundle._id);
      const sentPostsCount = await postsStore.countSentByBundle(bundle._id);
      const failedPostsCount = await postsStore.countFailedByBundle(bundle._id);
      const totalPostsCount = await postsStore.countAllByBundle(bundle._id);

      bundlesWithStats.push({
        ...bundle,
        waitingPostsCount,
        sentPostsCount,
        failedPostsCount,
        totalPostsCount,
      });
    }

    res.send(bundlesWithStats);
  } catch (err) {
    res.fail(err);
  }
});

router.route('bundles/show', async (req, res) => {
  try {
    const message = await bundlesStore.findById(req.data.id);
    res.send(message);
  } catch (err) {
    res.fail(err);
  }
});

router.route('bundles/create', async (req, res) => {
  try {
    const bundleData = {
      messageId: req.data.messageId,
      title: req.data.title,
      userIds: req.data.userIds,
    };

    const newBundle = await bundlesStore.create(bundleData);

    const newPostsData = req.data.users.map((user) => {
      const postData = {
        bundleId: newBundle._id,
        messageId: req.data.messageId,
        status: 'idle',
        lastErrorCode: null,
        attempts: 0,
        user,
      };

      return postData;
    });

    const newPosts = await postsStore.create(newPostsData);

    const responseData = {
      bundle: newBundle,
      posts: newPosts,
    };

    res.send(responseData);
  } catch (err) {
    res.fail(err);
  }
});

router.route('bundles/update', async (req, res) => {
  const bundleId = req.data._id;

  try {
    const oldBundle = await bundlesStore.findById(bundleId);
    const oldPosts = await postsStore.findAllByBundle(bundleId);

    const oldUserIds = oldBundle.userIds;
    const newUserIds = req.data.userIds;
    const newUsers = req.data.users;

    const addedUsers = newUsers.filter((user) => {
      return !oldUserIds.includes(user.id);
    });

    const removedPostsIds = oldPosts
      .filter((post) => {
        return !newUserIds.includes(post.user.id);
      })
      .map(post => post._id);

    const newPostsData = addedUsers.map((user) => {
      const postData = {
        bundleId,
        messageId: req.data.messageId,
        status: 'idle',
        lastErrorCode: null,
        attempts: 0,
        user,
      };

      return postData;
    });

    const bundleData = {
      messageId: req.data.messageId,
      title: req.data.title,
      userIds: req.data.userIds,
    };

    await bundlesStore.updateById(req.data._id, bundleData);
    await postsStore.create(newPostsData);
    await postsStore.removeAllByIds(removedPostsIds);

    res.send();
  } catch (err) {
    res.fail(err);
  }
});

router.route('bundles/remove', async (req, res) => {
  const bundleId = req.data.id;

  try {
    await bundlesStore.removeById(bundleId);
    await postsStore.removeAllByBundle(bundleId);
    res.send();
  } catch (err) {
    res.fail(err);
  }
});

router.route('posts/index', async (req, res) => {
  const bundleId = req.data.bundleId;

  try {
    const posts = await postsStore.findAllByBundle(bundleId);
    const postsWithQueue = posts.map((post) => {
      const isQueued = postSender.hasInQueue(post._id);
      return {
        ...post,
        isQueued,
      };
    });

    res.send(postsWithQueue);
  } catch (err) {
    res.fail(err);
  }
});

router.route('posts/send', async (req, res) => {
  const postId = req.data.id;

  await postSender.attemptSend(postId);

  res.send();
});

router.route('posts/sendAllByBundle', async (req, res) => {
  const bundleId = req.data.bundleId;

  const idlePosts = await postsStore.findAllIdleByBundle(bundleId);

  for (const post of idlePosts) {
    await postSender.attemptSend(post._id);
  }

  res.send();
});

router.route('posts/retryAllByBundle', async (req, res) => {
  const bundleId = req.data.bundleId;

  const failedPosts = await postsStore.findAllFailedByBundle(bundleId);

  for (const post of failedPosts) {
    await postSender.attemptSend(post._id);
  }

  res.send();
});

router.route('users/index', async (req, res) => {
  const messageId = req.data.messageId;

  try {
    const users = await vkApi.getFriends();

    const posts = await postsStore.findAllByMessage(messageId);
    const postMap = posts.reduce((map, post) => {
      map[post.user.id] = post;
      return map;
    }, {});

    const usersWithPosts = users.map((user) => {
      return {
        ...user,
        post: postMap[user.id] || null,
      };
    });

    res.send(usersWithPosts);
  } catch (err) {
    res.fail(err);
  }
});

router.route('albums/index', async (req, res) => {
  try {
    const albums = await vkApi.getAlbums();
    res.send(albums);
  } catch (err) {
    res.fail(err);
  }
});

router.route('photos/index', async (req, res) => {
  const albumId = req.data.albumId;
  try {
    const photos = await vkApi.getAlbumPhotos(albumId);
    res.send(photos);
  } catch (err) {
    res.fail(err);
  }
});

router.route('sender', async (req, res) => {
  const responseData = {
    hasQueueItems: postSender.hasQueueItems(),
    isInProgress: postSender.isInProgress(),
  };

  res.send(responseData);
});
