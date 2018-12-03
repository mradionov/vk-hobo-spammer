const BaseRepository = require('./BaseRepository');

class PostRepository extends BaseRepository {
  async getIndexByMessage(messageId) {
    const posts = await this.getIndex();

    const messagePosts = posts.filter(post => post.messageId === messageId);

    return messagePosts;
  }
}

module.exports = PostRepository;
