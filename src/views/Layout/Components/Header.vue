<template>
  <div class="header-warp">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" class="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/images/header_icon.jpg" alt />
        {{username}}
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" class="exit"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from "@vue/composition-api";

export default {
  name: "Header",
  setup(props, { root }) {
    const navMenuState = () => {
      root.$store.commit("app/SET_ISCOLLAPSE");
    };
    const username = computed(() => root.$store.state.app.user_name);
    console.log(username);
    const exit = () => {
      root.$store.dispatch("app/exit").then(res => {
        root.$router.push({
          name: "login"
        });
      });
    };
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>

<style lang="scss" scoped>
.header-warp {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: $layouHeader;
  background-color: #fff;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  line-height: 75px;
  transition: all 0.3s ease 0s;
  .header-icon {
    padding: 0 32px;
    svg {
      font-size: 25px;
      margin-bottom: -8px;
      cursor: pointer;
    }
  }
  .user-info {
    height: 100%;
    padding: 0 32px;
    border-right: 1px solid #ededed;
    img {
      width: 35px;
      height: 35px;
      vertical-align: middle;
      margin-right: 18px;
    }
    + .header-icon {
      padding: 0 28px;
    }
  }
}
.clone {
  .header-warp {
    left: $navMenuMin;
  }
}
</style>

