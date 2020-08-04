import router from './index';
import { getToken, removeToken, removeUserName } from '@/utils/app';
import store from '../store/index';

const whiteRouter = ['/login'];  //白名单判断

// 路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()) { //权限校验
    if (to.path === '/login') {
      removeToken()  //清除token
      removeUserName() //清除用户名
      store.commit('app/SET_TOKEN', '')
      store.commit('app/SET_USERNAME', '')
      next()
    } else {
      // 获取用户角色
      // 动态分配路由权限
      /**
       * 1.什么时候处理动态路由
       * 2.以什么条件处理
       */
      if (store.getters['app/roles'].length === 0) {
        store.dispatch('permission/getRouls').then(res => {
          let role = res.role;
          let button = res.button;
          console.log('store',res)
          let btnPerm = res.btnPerm;
          store.commit('app/SET_ROLES',role);
          store.commit('app/SET_BUTTON',btnPerm);
          store.dispatch('permission/createRouter', role).then(response => {
            let addRouter = store.getters['permission/addRouters'];
            let allRouters = store.getters['permission/allRouters'];
            // 路由更新
            router.options.routes = allRouters;
            //添加动态路由 
            router.addRoutes(addRouter);
            next({...to,replace:true})
          })
        })
      } else {
        next()

      }

    }

  } else {
    if (whiteRouter.includes(to.path)) {   //如果碰到有login的路由，那么不跳转
      next()
    } else {
      next('/login')

    }

  }

})