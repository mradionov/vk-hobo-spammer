const StoreBase = require('./StoreBase');

class BundlesStore extends StoreBase {

  findAllByMessage(messageId) {
    return this.find({ messageId });
  }

  removeAllByMessage(messageId) {
    return this.removeAll({ messageId });
  }

}

module.exports = BundlesStore;
