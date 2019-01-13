const Datastore = require('nedb');

class StoreBase {

  constructor(filePath) {
    this.ds = new Datastore({
      filename: filePath,
      autoload: true,
      timestampData: true,
    });
  }

  async create(doc) {
    return new Promise((resolve, reject) => {
      this.ds.insert(doc, (err, newDoc) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  async update(query, update) {
    return new Promise((resolve, reject) => {
      this.ds.update(query, update, (err, newDoc) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  async updateById(id, update) {
    return this.update({ _id: id }, update);
  }

  async remove(query, options = {}) {
    return new Promise((resolve, reject) => {
      this.ds.remove(query, options, (err, numRemoved) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  async removeAll(query) {
    return this.remove(query, { multi: true });
  }

  async removeById(id) {
    return this.remove({ _id: id });
  }

  async find(query = {}, sort = {}) {
    return new Promise((resolve, reject) => {
      this.ds
        .find(query)
        .sort(sort)
        .exec((err, docs) => {
          if (err !== null) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
    });
  }

  async findAll() {
    return this.find({}, { createdAt: -1 });
  }

  async findOne(query = {}) {
    return new Promise((resolve, reject) => {
      this.ds.findOne(query, (err, doc) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async count(query = {}) {
    return new Promise((resolve, reject) => {
      this.ds.count(query, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

}

module.exports = StoreBase;
