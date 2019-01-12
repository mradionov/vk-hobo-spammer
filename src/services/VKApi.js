const lodash = require('lodash');

const HTTPService = require('./HTTPService');

function VKError(errorData = {}) {
  this.name = 'VKError';
  this.message = errorData.error_msg || 'Unknown';
  this.vkCode = errorData.error_code || 0;
  this.code = `vk:${this.vkCode}`;
}

VKError.prototype = Object.create(Error.prototype);

class VKApi {

  constructor(options = {}) {
    const {
      accessTokenFactory = () => {},
    } = options;

    this.http = new HTTPService({
      baseURL: 'https://api.vk.com/method',
      params: {
        v: '5.73',
      },
    });

    this.http.addConfigInterceptor((config) => {
      const accessToken = accessTokenFactory();
      if (!accessToken) {
        return config;
      }

      const updatedConfig = lodash.merge({}, config, {
        params: {
          access_token: accessToken,
        },
      });

      return updatedConfig;
    });
  }

  async getProfile() {
    const response = await this.http.get('users.get', {
      params: {
        fields: 'first_name,last_name,photo_50',
      },
    });

    const { error, response: data } = response.data;

    if (error !== undefined) {
      throw new VKError(error);
    }

    const users = data;
    const profile = users[0];

    return profile;
  }

  async getFriends() {
    const response = await this.http.get('friends.get', {
      params: {
        fields: 'first_name,last_name,photo_50,city',
        order: 'name',
      },
    });

    const { error, response: data } = response.data;

    if (error !== undefined) {
      throw new VKError(error);
    }

    const friends = data.items;
    return friends;
  }

  async sendMessage(peerId, randomId, message, attachmentIds = []) {
    const attachment = attachmentIds.join(',');

    const response = await this.http.post('messages.send', {
      data: {
        peer_id: peerId,
        random_id: randomId,
        message,
        attachment,
      },
    });

    const { error, response: data } = response.data;

    if (error !== undefined) {
      throw new VKError(error);
    }

    const result = data;
    return result;
  }

  async getAlbums() {
    const response = await this.http.get('photos.getAlbums', {
      params: {
        need_covers: true,
        need_system: true,
      },
    });

    const { error, response: data } = response.data;

    if (error !== undefined) {
      throw new VKError(error);
    }

    const albums = data.items;
    return albums;
  }

  async getAlbumPhotos(albumId) {
    const response = await this.http.get('photos.get', {
      params: {
        album_id: albumId,
        rev: 1,
      },
    });

    const { error, response: data } = response.data;

    if (error !== undefined) {
      throw new VKError(error);
    }

    const photos = data.items;
    return photos;
  }

}

module.exports = VKApi;
