<template>
  <div class="container">
    <div class="friend-list">
      <h3>
        Friends
        <Button>Add all</Button>
      </h3>
      <FriendList
        :users="friends"
        @select="onFriendSelect"
      />
    </div>
    <div class="send-list">
      <h3>Send to</h3>
      <SendList
        :users="recepients"
        @select="onRecepientSelect"
      />
    </div>
    <div class="message">
      <h3>Message</h3>
      <textarea
        class="message-input"
        v-model="message"
      />
      <input
        class="random"
        placeholder="Job Random ID"
        v-model="randomId"
      />
      <div class="controls">
        <Button
          @click="onSend"
          :disabled="isSending"
        >
          Send
        </Button>
        <Button @click="onReset">
          Reset
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../components/Button';
import FriendList from '../components/FriendList';
import SendList from '../components/SendList';

export default {

  components: {
    Button,
    FriendList,
    SendList,
  },

  inject: ['api'],

  data() {
    return {
      friends: [],
      isSending: false,
      message: '',
      randomId: '1',
      recepients: [],
    };
  },

  async mounted() {
    try {
      this.friends = await this.api.getFriends();
    } catch (err) {
      console.error(err);
    }
  },

  methods: {

    onFriendSelect(userToAdd) {
      this.recepients.push(userToAdd);
    },

    onRecepientSelect(userToRemove) {
      this.recepients = this.recepients.filter(user => user.id !== userToRemove.id);
    },

    async onSend() {
      this.onBeforeSend();

      const { message, randomId, recepients } = this;

      const cleanMessage = message.trim();
      if (cleanMessage.length === 0) {
        window.alert('Must have some text');
        this.onAfterSend();
        return;
      }

      const cleanRandomId = randomId.trim();
      if (cleanRandomId.length === 0) {
        window.alert('Must have random id');
        this.onAfterSend();
        return;
      }

      if (!Number(cleanRandomId)) {
        window.alert('Random id must be a number');
        this.onAfterSend();
        return;
      }

      if (recepients.length === 0) {
        window.alert('You must have at lest one recepient');
        this.onAfterSend();
        return;
      }

      for (let recepient of recepients) {
        recepient.isSending = true;

        const peerId = recepient.id;
        const totalRandomId = peerId + cleanRandomId;
        const text = cleanMessage;

        try {
          const result = await this.api.sendMessage(peerId, totalRandomId, text);
          recepient.isSending = false;
          recepient.isSent = true;
        } catch (err) {
          recepient.isSending = false;
          recepient.isFailed = true;
        }

        await this.delay(1000);
      }

      window.alert('All messages succesfully sent');

      this.onAfterSend();
    },

    onBeforeSend() {
      this.isSending = true;
    },

    onAfterSend() {
      this.isSending = false;
    },

    delay(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    },

    onReset() {
      this.friends.push(...this.recepients);
      this.recepients = [];
      this.message = '';
      this.randomId = '1';
    },

  },

};
</script>

<style scoped>
.container {
  display: flex;
}

.friend-list {
  flex: 1;
}

.send-list {
  flex: 1;
}

.message {
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.message-input {
  height: 100px;
  margin-bottom: 30px;
  width: 400px;
}

.is-sending {
  color: orange;
}

.is-sent {
  color: green;
}

.is-failed {
  color: red;
}

.controls {
  display: flex;
  flex-direction: row;
}

.random {
  margin-bottom: 10px;
}
</style>
