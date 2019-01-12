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
    if (this.progressId !== null) {
      this.queue.push(post._id);
      await this.db.posts.updateStatus(post._id, POST_STATUSES.queued);
      this.emit('update');
      return;
    }

    const firstQueueId = this.queue[0];
    if (firstQueueId === post._id) {
      this.queue.shift();
    }

    await this.db.posts.updateStatus(post._id, POST_STATUSES.progress);
    this.progressId = post._id;
    this.emit('update');

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
    }

    this.progressId = null;
    this.emit('update');

    // Don't overwhelm VK api with requests
    setTimeout(async () => {
      this.attemptSendNext();
    }, 1000);
  }

  attemptSendNext() {
    if (this.queue.length === 0) {
      return;
    }

    const queuedId = this.queue[0];

    this.attemptSend(queuedId);
  }

  isSending() {
    return this.progressId !== null || this.queue.length > 0;
  }

}

module.exports = PostSender;
