<template>
  <span
    :class="[
      $style.box,
      checked && $style.checked,
    ]"
  >
  </span>
</template>

<script>
export default {

  props: {
    checked: Boolean,
    default: () => false,
  },
};
</script>

<style module>
.box {
  background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cdefs%3E%3Crect%20id%3D%22a%22%20width%3D%2215%22%20height%3D%2215%22%20rx%3D%223%22%2F%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cuse%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20x%3D%22.5%22%20y%3D%22.5%22%20stroke%3D%22%23C1C9D1%22%20rx%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E);
  display: inline-block;
  height: 15px;
  width: 15px;
}

.checked {
  background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20width%3D%2215%22%20height%3D%2215%22%20fill%3D%22%235181B8%22%20rx%3D%223%22%2F%3E%3Cpath%20stroke%3D%22%23FFF%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M4%207.5L6.5%2010%2011%204.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E);
}
</style>
