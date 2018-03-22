const pathHelper = require('path');

const fs = require('./fs');

class Cache {
  constructor(path) {
    this.path = path;
    this.data = {};
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  remove(key) {
    delete this.data[key];
  }

  async load() {
    try {
      this.data = await fs.readJSON(this.path, {});
    } catch (err) {
      if (err.code === 'ENOENT') {
        // It's fine if file does not exist, it will be created on save
        return;
      }

      throw err;
    }
  }

  async save() {
    // Make sure directory for cache exists
    const dirPath = pathHelper.dirname(this.path);
    await fs.makeDir(dirPath);

    return fs.writeJSON(this.path, this.data);
  }
}

module.exports = Cache;
