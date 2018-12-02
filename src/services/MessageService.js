const fs = require('../lib/fs');

class MessageService {
  constructor(options = { indexPath: '' }) {
    this.options = options;
  }

  async create(data) {
    const messages = await this.getIndex();

    const lastMessage = messages[messages.length - 1] || {};
    const lastMessageId = lastMessage.id || 0;
    const nextMessageId = lastMessageId + 1;

    const message = data;
    message.id = nextMessageId;
    message.createdAt = Date.now();

    messages.push(message);

    await this.saveIndex(messages);

    return message;
  }

  async update(messageId, data) {
    const messages = await this.getIndex();

    const messageIndex = messages.findIndex(message => message.id === messageId);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }

    const foundMessage = messages[messageIndex];
    const updatedMessage = Object.assign({}, foundMessage, data, { id: messageId });

    messages.splice(messageIndex, 1, updatedMessage);

    await this.saveIndex(messages);

    return updatedMessage;
  }

  async remove(messageId) {
    const messages = await this.getIndex();

    const messageIndex = messages.findIndex(message => message.id === messageId);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }

    messages.splice(messageIndex, 1);

    await this.saveIndex(messages);
  }

  async get(messageId) {
    const messages = await this.getIndex();
    const foundMessage = messages.find(message => message.id === messageId);
    if (foundMessage === undefined) {
      throw new Error('Message not found');
    }
    return foundMessage;
  }

  async getIndex() {
    let messages = [];
    try {
      messages = await fs.readJSON(this.options.indexPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // It's fine if file does not exist yet. It will be created with the
        // first added message.
      } else {
        throw err;
      }
    }
    return messages;
  }

  async saveIndex(messages) {
    return fs.writeJSON(this.options.indexPath, messages);
  }
}

module.exports = MessageService;
