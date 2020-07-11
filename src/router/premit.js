import router from './index';
import { getToken,removeToken,removeUserName } from '@/utils/app';
import store from '../store/index';

const whiteRouter = ['/login'];  //白名单判断

// 路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()) { //权限校验
    if(to.path === '/login'){
      removeToken()  //清除token
      removeUserName() //清除用户名
      store.commit('app/SET_TOKEN', '')
      store.commit('app/SET_USERNAME', '')
      next()
    }else {
      next()
    }
    
  } else {
    if (whiteRouter.includes(to.path)) {   //如果碰到有login的路由，那么不跳转
      next()
    } else { 
      next('/login')

    }

  }

})