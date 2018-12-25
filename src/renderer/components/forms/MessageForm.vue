<template>
  <div>
    <div :class="$style.group">
      <div :class="$style.label">
        Title:
      </div>
      <div :class="$style.field">
        <input
          :class="$style.input"
          type="text"
          v-model.trim="fields.title"
        />
      </div>
    </div>
    <div :class="$style.group">
      <div :class="$style.label">
        Text:
      </div>
      <div :class="$style.field">
        <textarea
          :class="$style.input"
          v-model.trim="fields.text"
          cols="100"
          rows="30"
        >
        </textarea>
        <br />
        <br />
        <span
          :class="{
            [$style.maxText]: isTextCountExceeded
          }
        ">
          Character count:
          <b>{{characterCount}}/{{maxCount}}</b>
        </span>
      </div>
    </div>
    <hr />
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
import Button from '../presenters/Button';

export default {

  components: {
    Button,
  },

  props: {
    initialValues: {
      type: Object,
      default: () => ({
        title: '',
        text: '',
      }),
    },
  },

  data() {
    return {
      fields: this.initialValues || {
        title: '',
        text: '',
      },
    };
  },

  computed: {
    characterCount() {
      return this.fields.text.length;
    },
    maxCount() {
      return 4096;
    },
    isTextCountExceeded() {
      return this.characterCount >= this.maxCount;
    },
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

.input {
  border: 1px solid #d3d9de;
  border-radius: 2px;
  color: #000;
  margin: 0;
  padding: 3px 5px;
}

.maxText {
  color: #de0400;
}
</style>
