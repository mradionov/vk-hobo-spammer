<template>
  <span
    :class="{
      [$style.text]: true,
      [$style.sent]: status === POST_STATUSES.sent,
      [$style.failed]: status === POST_STATUSES.failed,
    }"
  >
    {{status}}
  </span>
</template>

<script>
import { POST_STATUSES } from '../../constants/post';

export default {

  props: {

    status: {
      required: true,
      type: String,
      validator: function (value) {
        return Object.values(POST_STATUSES).includes(value);
      },
    },

  },

  computed: {
    POST_STATUSES() {
      return POST_STATUSES;
    },
  },

};
</script>

<style module>
.text {
  font-weight: bold;
}

.sent {
  color: #40964c;
}

.failed {
  color: #de0400;
}
</style>
