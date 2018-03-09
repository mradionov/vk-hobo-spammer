const fs = require('fs');

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

  load() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, serializedData) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // It's fine if file does not exist
            resolve();
            return;
          }

          reject(err);
          return;
        }

        this.data = JSON.parse(serializedData);

        resolve();
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      const serializedData = JSON.stringify(this.data);
      fs.writeFile(this.path, serializedData, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Cache;
