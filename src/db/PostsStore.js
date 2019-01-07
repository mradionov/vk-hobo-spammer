const { POST_STATUSES } = require('../constants/post');

const StoreBase = require('./StoreBase');

class PostsStore extends StoreBase {

  updateStatus(id, status) {
    return this.updateById(id, {
      $set: {
        status,
      },
    });
  }

  removeAllByIds(ids) {
    return this.removeAll({
      $where: function() {
        return ids.includes(this._id);
      },
    });
  }

  removeAllByBundle(bundleId) {
    return this.removeAll({ bundleId });
  }

  removeAllByBundles(bundleIds) {
    return this.removeAll({
      $where: function() {
        return bundleIds.includes(this.bundleId);
      },
    });
  }

  findAllByBundle(bundleId) {
    return this.find({ bundleId });
  }

  findAllIdleByBundle(bundleId) {
    return this.find({
      bundleId,
      status: POST_STATUSES.idle,
    });
  }

  findAllFailedByBundle(bundleId) {
    return this.find({
      bundleId,
      status: POST_STATUSES.failed,
    });
  }

  countWaitingByBundle(bundleId) {
    return this.count({
      bundleId,
      $or: [
        { status: POST_STATUSES.idle },
        { status: POST_STATUSES.queued },
        { status: POST_STATUSES.progress },
      ],
    });
  }

  countSentByBundle(bundleId) {
    return this.count({
      bundleId,
      status: POST_STATUSES.sent,
    });
  }

  countFailedByBundle(bundleId) {
    return this.count({
      bundleId,
      status: POST_STATUSES.failed,
    });
  }

  countAllByBundle(bundleId) {
    return this.count({
      bundleId,
    });
  }

}

module.exports = PostsStore;
