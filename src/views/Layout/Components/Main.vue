<template>
  <div class="main-wrap">
    <div class="main-content">
      <div class="content">
        <keep-alive>
          <!-- 缓存 -->
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main"
};
</script>

<style lang="scss" scoped>
.main-wrap {
  // position: fixed;
  // left: $navMenu;
  // top: 75px;
  // right: 0;
  // bottom: 0;
  // background-color: pink;
  // border: 30px solid #f4f4f4;
  // border-bottom: none;
  height: 100vh;
}
.main-content {
  width: 100%;
  height: 100%;
  padding: $layouHeader + 30 30px 0 $navMenu + 30;

  box-sizing: border-box;
  transition: all 0.3s ease 0s;
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  box-sizing: border-box;
  background-color: #fff;
}
.clone {
  .main-content {
    padding-left: 90px;
  }
}
</style>