import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '@/views/Layout';

Vue.use(VueRouter);

/**
 * 默认路由
 */
export const defaultRouterMap = [
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

];
/**
 * 动态路由
 * ["信息功能", "用户功能"]
 */
export const asnycRouter = [
  {
    path: "/info",
    name: "Info",
    meta: {

      role: ['技术员', '业务员', '部门经理'],
      name: '信息管理',
      icon: 'info',
      system: "信息功能"
    },
    component: Layout,
    children: [
      {
        path: "/infoindex",
        name: "Infoindex",
        meta: {
          keepAlive: true,
          role: ['技术员', '业务员', '部门经理'],
          name: '信息列表'
        },
        component: () => import("../views/Info/index.vue"),
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          role: ['技术员', '业务员', '部门经理'],
          name: '信息分类'
        },
        component: () => import("../views/Info/category.vue"),
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          role: ['技术员', '业务员', '部门经理'],
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
      role: ['技术员', '业务员', '部门经理'],
      name: '用户管理',
      icon: 'user',
      system: "用户功能"
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/userindex",
        name: "Userindex",
        meta: {
          keepAlive: true,
          role: ['技术员', '业务员', '部门经理'],
          name: '用户列表'
        },
        component: () => import("../views/User/index.vue"),
      }
    ]
  },
  /**
   * 404页面
   */
  {
    path: "/page404",
    name: "404",
    hidden: true,
    meta: {
      name: '404',
      icon: '404',
    },
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/404",
        meta: {
          name: '404'
        },
        component: () => import("../views/404.vue"),
      }
    ]
  }, 
  {
    path: "*",
    redirect: '404',
    hidden: true,
  }

]


const router = new VueRouter({
  routes: defaultRouterMap
});

export default router;

