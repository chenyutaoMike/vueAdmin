import { GetUserRole } from '@/api/login';
import { defaultRouterMap, asnycRouter } from '@/router';


function hasPremission(roles, router) {
  if (router.meta && router.meta.role) {
    return roles.some(item => router.meta.role.indexOf(item) >= 0)
  }
}

const state = {

  allRouters: defaultRouterMap,
  addRouters: [],

}
const mutations = {

  SET_ROUTER(state, router) {
    state.addRouters = router;
    state.allRouters = defaultRouterMap.concat(router)
  }
}
const actions = {
  /**
   * 获取用户角色
   * @param {*} param0 
   */
  getRouls({ commit }) {
    return new Promise((resolve, reject) => {
      GetUserRole().then(res => {

        let data = res.data.data;
        resolve(data)
      })
    })
  },
  /**
   * 创建动态路由
   */
  createRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      let role = data;

      let addRouters = [];
      if (role.includes('admin')) {
        // 超管
        addRouters = asnycRouter;
      } else {
        // 普通管理员
        addRouters = asnycRouter.filter(item => {

          if (hasPremission(role, item)) {
            if (item.children && item.children.length > 0) {
              // 如果有子路由
              item.children = item.children.filter(childrenItem => {
                if (hasPremission(role, childrenItem)) {
                  return childrenItem
                }
              })

            }
            return item
          }
        })
      }
      // 添加404页面
      addRouters.push(asnycRouter[asnycRouter.length - 1])
  
      // 更新路由
      commit('SET_ROUTER', addRouters)
      resolve()
    })
  }
}
const getters = {
  allRouters: state => state.allRouters, //所有的
  addRouters: state => state.addRouters // 匹配的
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}