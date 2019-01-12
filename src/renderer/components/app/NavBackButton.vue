<template>
  <button
    :class="$style.container"
    @click="$router.go(-1)"
  >
    {{$t('back')}}
  </button>
</template>

<script>
export default {

  i18n: {
    messages: {
      en: {
        back: 'Back',
      },
      ru: {
        back: 'Назад',
      },
    },
  },

};
</script>

<style module>
.container {
  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%229%22%20height%3D%2216%22%20viewBox%3D%220%200%209%2016%22%3E%3Cpath%20fill%3D%22%23828A99%22%20d%3D%22M8%2015.9c-.2%200-.4-.1-.6-.3l-7-7c-.3-.3-.3-.9%200-1.2l7-7c.3-.3.9-.3%201.2%200%20.3.3.3.9%200%201.2l-6.4%206.4%206.4%206.4c.3.3.3.9%200%201.2-.2.2-.4.3-.6.3z%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E') 0 6px no-repeat;
  border: 0;
  color: #818d99;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 30px;
  margin-right: 10px;
  padding-left: 20px;
}

.container:hover {
  opacity: 0.7;
}
</style>
