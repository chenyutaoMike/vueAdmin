<template>
  <div class="nav-wrap" :class="isCollapse?'clone':'open'">
    <h1 class="logo">
      <img src="../../../assets/images/logo.png" alt />
    </h1>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="transparent"
      text-color="#fff"
      :router="true"
      :collapse="isCollapse"
    >
      <!-- 一级菜单 -->
      <template v-for="item in routers">
        <el-submenu :index="item.path" :key="item.id" v-if="!item.hidden">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
            <span>{{item.meta.name}}</span>
          </template>
          <!-- 子级菜单 -->
          <template v-for="subItem in item.children">
            <el-menu-item
              v-if="!subItem.hidden"
              :index="subItem.path"
              :key="subItem.path"
            >{{subItem.meta.name}}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { ref, reactive, computed } from "@vue/composition-api";
import { mapState } from "vuex";
export default {
  name: "LayoutNav",
  setup(props, { root }) {
    /**
     * data数据
     */
    const routers = reactive(root.$router.options.routes);
    /**
     * computed 监听
     */
    const isCollapse = computed(() => root.$store.state.app.isCollapse);
    const defaultActive = computed(() => {
      const {path} = root.$route;
      return path
    });

  
    /**
     * methods 函数
     */

    return {
      isCollapse,
      routers,
      defaultActive
    };
  }
};
</script>

<style lang="scss" scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  transition: all 0.3s ease 0s;

  .logo {
    text-align: center;
    img {
      margin-top: 10px;
      width: 80px;
      height: 80px;
    }
  }
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.clone {
  .nav-wrap {
    width: $navMenuMin;
    .logo {
      img {
        width: 60px;
        height: 60px;
      }
    }
  }
  .el-submenu {
    &.is-opened {
      > .el-submenu_title {
        background-color: red;
      }
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: $navMenu;
  min-height: 400px;
}
.el-menu-item .is-active {
  background-color: pink !important;
}
</style>