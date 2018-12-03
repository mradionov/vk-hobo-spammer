const fs = require('../lib/fs');

class BaseRepository {
  constructor(options = { indexPath: '' }) {
    this.options = options;
  }

  async create(data) {
    const items = await this.getIndex();

    const lastItem = items[items.length - 1] || {};
    const lastItemId = lastItem.id || 0;
    const nextItemId = lastItemId + 1;

    const item = data;
    item.id = nextItemId;
    item.createdAt = Date.now();

    items.push(item);

    await this.saveIndex(items);

    return item;
  }

  async update(itemId, data) {
    const items = await this.getIndex();

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const foundItem = items[itemIndex];
    const updatedItem = Object.assign({}, foundItem, data, { id: itemId });

    items.splice(itemIndex, 1, updatedItem);

    await this.saveIndex(items);

    return updatedItem;
  }

  async remove(itemId) {
    const items = await this.getIndex();

    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    items.splice(itemIndex, 1);

    await this.saveIndex(items);
  }

  async get(itemId) {
    const items = await this.getIndex();
    const foundItem = items.find(item => item.id === itemId);
    if (foundItem === undefined) {
      throw new Error('Item not found');
    }
    return foundItem;
  }

  async getIndex() {
    let items = [];
    try {
      items = await fs.readJSON(this.options.indexPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // It's fine if file does not exist yet. It will be created with the
        // first added item.
      } else {
        throw err;
      }
    }
    return items;
  }

  async saveIndex(items) {
    return fs.writeJSON(this.options.indexPath, items);
  }
}

module.exports = BaseRepository;
