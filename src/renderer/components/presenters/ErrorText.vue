<template>
  <span :title="message">{{message}}</span>
</template>

<script>
import errorHelper from '../../helpers/errorHelper';

export default {

  props: {
    code: {
      type: String,
      default: null,
    },
  },

  computed: {
    message() {
      if (!this.code) {
        return '-';
      }
      return errorHelper.getMessageFromCode(this.code);
    },
  },

};
</script>
