function VKError(errorData = {}) {
  this.name = 'VKError';
  this.message = errorData.error_msg || 'Unknown';
  this.vkCode = errorData.error_code || 0;
  this.code = `vk:${this.vkCode}`;
}

VKError.prototype = Object.create(Error.prototype);

class VKApi {
  constructor(http) {
    this.http = http;
  }

  async getFriends() {
    const data = await this.http.get('friends.get', {
      params: {
        fields: 'first_name,last_name',
        order: 'name',
      },
    });

    const { error, response } = data;
    if (error !== undefined) {
      throw error;
    }

    const friends = response.items;
    return friends;
  }

  async getProfile() {
    const data = await this.http.get('users.get', {
      params: {
        fields: 'first_name,last_name,photo_50',
      },
    });

    const { error, response } = data;
    if (error !== undefined) {
      throw error;
    }

    const users = response;
    const profile = users[0];
    return profile;
  }

  async sendMessage(peerId, randomId, message) {
    const data = await this.http.post('messages.send', {
      params: {
      },
      data: {
        peer_id: peerId,
        random_id: randomId,
        message,
      },
    });

    const { error, response } = data;
    if (error !== undefined) {
      throw new VKError(error);
    }

    const result = response;
    return result;
  }
}

VKApi.TOKEN_ERROR = 5;
VKApi.BAD_REQUEST = 100;

export {
  VKError,
};

export default VKApi;
