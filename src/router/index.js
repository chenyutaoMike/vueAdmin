import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '@/views/Layout';

Vue.use(VueRouter);


const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: '首页'
    }
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    meta: {
      name: '登陆'
    },
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    meta: {
      name: '控制台',
      icon: 'console'
    },
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: "/index",
        name: "index",
        meta: {
          name: '首页'
        },
        component: () => import("../views/Console/index.vue"),
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    meta: {
      name: '信息管理',
      icon: 'info'
    },
    component: Layout,
    children: [
      {
        path: "/infoindex",
        name: "Infoindex",
        meta: {
          name: '信息列表'
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          name: '信息分类'
        },
        component: () => import("../views/Info/category.vue"),
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden:true,
        meta: {
          name: '信息详情'
        },
        component: () => import("../views/Info/detailed.vue"),
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: '用户管理',
      icon: 'user'
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/userindex",
        name: "Userindex",
        meta: {
          name: '用户列表'
        },
        component: () => import("../views/User/index.vue"),
      }
    ]
  }

];

const router = new VueRouter({
  routes
});

export default router;

