<template>
  <div>
    <div :class="$style.group">

    </div>
    <div :class="$style.group ">
      <div :class="$style.label" />
      <div :class="$style.field">
        <Button @click="onSave">
          Save
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../basic/Button';

export default {

  components: {
    Button,
  },

  props: {
    initialValues: {
      type: Object,
      default: () => ({
        userIds: [],
      }),
    },
  },

  data() {
    return {
      fields: this.initialValues || {
        userIds: [],
      },
    };
  },

  watch: {
    initialValues(initialValues) {
      this.fields = initialValues;
    },
  },

  methods: {
    onSave() {
      this.$emit('submit', this.fields);
    },
  },

};
</script>

<style module>
.group {
  display: flex;
}

.label {
  color: #656565;
  text-align: right;
  padding: 6px 12px 7px 0;
  width: 100px;
}
</style>
