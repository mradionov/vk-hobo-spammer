<template>
  <div>
    <Group>
      <Label>{{$t('name')}}</Label>
      <Field>
        <input
          type="text"
          v-model.trim="fields.name"
          @input="handleNameChange"
        />
      </Field>
    </Group>

    <hr />

    <Group>
      <Button @click="handleReset">
        {{$t('reset')}}
      </Button>
    </Group>
  </div>
</template>

<script>
import Button from '../presenters/Button';
import { Field, Group, Label } from '../presenters/VerticalForm';

const DEFAULT_FIELDS = {
  name: '',
};

export default {

  components: {
    Button,
    Field,
    Group,
    Label,
  },

  data() {
    return {
      fields: Object.assign({}, DEFAULT_FIELDS),
    };
  },

  methods: {

    handleReset() {
      this.fields = Object.assign({}, DEFAULT_FIELDS);
      this.$emit('reset');
    },

    handleNameChange() {
      const fields = Object.assign({}, this.fields);
      this.$emit('change', fields);
    },

  },

  i18n: {
    messages: {
      en: {
        name: 'Name',
        reset: 'Reset',
      },
      ru: {
        name: 'Имя',
        reset: 'Сбросить',
      },
    },
  },

};
</script>

<style module>

</style>
