<template>
  <span :title="message">{{message}}</span>
</template>

<script>
// https://vk.com/dev/errors

const NAMESPACES = {
  vk: 'vk',
  http: 'http',
};

export default {

  props: {
    code: {
      type: String,
      default: null,
    },
  },

  computed: {
    message() {
      const fullCode = this.code;
      if (!fullCode) {
        return '-';
      }

      const [namespace, code] = fullCode.split(':');

      if (namespace === NAMESPACES.vk && !this.$te(fullCode)) {
        return `[${fullCode}] ${this.$t('vk:unknown')}`;
      }

      if (namespace === NAMESPACES.http && !this.$te(fullCode)) {
        return `[${fullCode}] ${this.$t('http:unknown')}`;
      }

      return `[${fullCode}] ${this.$t(fullCode)}`;
    },
  },

  i18n: {
    messages: {
      en: {
        'vk:unknown': 'Unknown VK error',
        'vk:10': 'Internal server error. Try again later. Probably message with this id is already sent to the user.',
        'vk:14': 'Captcha needed',
        'vk:100': 'One of the parameters specified was missing or invalid',
        'vk:914': 'Message is too long',
        'http:unknown': 'Unknown HTTP error',
        'http:400': 'Bad request',
        'http:401': 'Not authenticated',
        'http:403': 'Not authorized',
        'http:404': 'Not found',
        'http:500': 'Server error',
      },
      ru: {
        'vk:unknown': 'Неизвестная ошибка ВК',
        'vk:10': 'Ошибка сервера. Попробуйте позже. Возможно это сообщение уже отправлено пользователю',
        'vk:14': 'Необходимо ввести капчу',
        'vk:100': 'Один из параметров запроса отсутствует или некорректен',
        'vk:914': 'Сообщение слишком длинное',
        'http:unknown': 'Неизвестная ошибка HTTP',
        'http:400': 'Плохой запрос',
        'http:401': 'Не аутентификацирован',
        'http:403': 'Не авторизован',
        'http:404': 'Не найдено',
        'http:500': 'Ошибка сервера',
      },
    },
  },

};
</script>
