<template>
  <div id="app">

    <router-view />
  </div>
</template>

<style lang="scss">
@import url("../src/assets/css/reset.scss");
@import url("../src/assets/css/common.css");
/*动画方法*/
@mixin webkit($type,$value) {
  -webkit-#{$type}:$value;
  -moz-#{$type}: $value;
  -o-#{$type}: $value;
  -ms-#{$type}: $value;
  #{$type}: $value;
}
</style>
