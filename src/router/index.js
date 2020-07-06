import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    component: () => import("../views/Layout/index.vue"),
    children: [
      {
        path: "/console",
        redirect: "/consoleIndex"
      },
      {
        path: "/consoleIndex",
        name: "ConsoleIndex",
        component: () => import("../views/Console/index.vue"),
      }
    ]

  }

];

const router = new VueRouter({
  routes
});

export default router;

