<template>
  <form @submit="handleSubmit">
    <Group>
      <Label>Title</Label>
      <Field>
        <input
          type="text"
          :class="$style.input"
          v-model.trim="fields.title"
          maxlength="50"
          required
        />
      </Field>
    </Group>

    <Group>
      <Label>Text</Label>
      <Field>
        <textarea
          :class="$style.input"
          v-model.trim="fields.text"
          cols="100"
          rows="30"
          maxlength="4096"
          required
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
      </Field>
    </Group>

    <hr />

    <Group>
      <Label />
      <Field>
        <Button type="submit">
          Save
        </Button>
      </Field>
    </Group>
  </form>
</template>

<script>
import Button from '../presenters/Button';
import { Field, Group, Label } from '../presenters/HorizontalForm';

export default {

  components: {
    Button,
    Field,
    Group,
    Label,
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

    handleSubmit() {
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
