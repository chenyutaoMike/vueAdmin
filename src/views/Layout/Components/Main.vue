<template>
  <div class="main-wrap">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.main-wrap {
  position: fixed;
  left: $navMenu;
  top: 75px;
  right: 0;
  bottom: 0;
  background-color: pink;
  border: 30px solid #f4f4f4;
  border-bottom: none;
}
</style>