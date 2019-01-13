const EventEmitter = require('events');

const { POST_STATUSES } = require('../constants/post');

class PostSender extends EventEmitter {

  constructor(cache, db, vkApi) {
    super();

    this.cache = cache;
    this.db = db;
    this.vkApi = vkApi;

    this.queue = [];
    this.progressId = null;
  }

  async init() {
    this.queue = this.cache.get('queue') || [];
    this.progressId = this.cache.get('progressId') || null;
  }

  async attemptSend(postId) {
    const post = await this.db.posts.findById(postId);

    // If post is already in progress or sent, don't queue it and no need
    // to send it.
    if (post.status === POST_STATUSES.progress
      || post.status === POST_STATUSES.sent
    ) {
      return;
    }

    // If there is something currently sending, queue the post
    if (this.isInProgress()) {
      await this.addToQueue(post._id);
      await this.db.posts.updateStatus(post._id, POST_STATUSES.idle);
      return;
    }

    const firstQueueId = this.queue[0];
    if (firstQueueId === post._id) {
      await this.shiftQueue();
    }

    await this.db.posts.updateStatus(post._id, POST_STATUSES.progress);
    await this.setProgress(post._id);

    setTimeout(() => {
      this.send(postId);
    }, 1000);
  }

  attemptSendNext() {
    if (this.queue.length === 0) {
      return;
    }

    const queuedId = this.queue[0];

    this.attemptSend(queuedId);
  }

  async send(postId) {
    const post = await this.db.posts.findById(postId);
    const bundle = await this.db.bundles.findById(post.bundleId);
    const message = await this.db.messages.findById(bundle.messageId);

    try {
      const peerId = post.user.id;
      const randomId = message.randomId;
      const text = message.text;
      const attachmentIds = message.attachments.map((attachment) => {
        return `${attachment.type}${attachment.ownerId}_${attachment.id}`;
      });

      await this.vkApi.sendMessage(peerId, randomId, text, attachmentIds);

      await this.db.posts.updateById(post._id, {
        $set: {
          status: POST_STATUSES.sent,
          lastErrorCode: null,
        },
      });

      await this.clearProgress();

      // Continue with the next message only of previous succeeded
      // Don't overwhelm VK api with requests
      setTimeout(async () => {
        this.attemptSendNext();
      }, 1000);
    } catch (err) {
      await this.db.posts.updateById(post._id, {
        $set: {
          status: POST_STATUSES.failed,
          lastErrorCode: err.code,
        },
        $inc: {
          attempts: 1,
        },
      });

      await this.clearQueue();
      await this.clearProgress();
    }
  }

  async addToQueue(postId) {
    this.queue.push(postId);
    await this.persist();
    this.emit('update');
  }

  async shiftQueue() {
    this.queue.shift();
    await this.persist();
    this.emit('update');
  }

  async clearQueue() {
    this.queue = [];
    await this.persist();
    this.emit('update');
  }

  async setProgress(postId) {
    this.progressId = postId;
    await this.persist();
    this.emit('update');
  }

  async clearProgress() {
    this.progressId = null;
    await this.persist();
    this.emit('update');
  }

  async persist() {
    this.cache.set('progressId', this.progressId);
    this.cache.set('queue', this.queue);
    await this.cache.save();
  }

  isInProgress() {
    return this.progressId !== null;
  }

  hasQueueItems() {
    return this.queue.length > 0;
  }

  hasInQueue(postId) {
    return this.queue.includes(postId);
  }

}

module.exports = PostSender;
