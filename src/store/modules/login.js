
import { Login } from "@/api/login.js";
const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
}
const mutations = {
  SET_ISCOLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
  }
}
const actions = {
  login(context, requestData) {
    return new Promise((res, rej) => {
      // 接口
      Login(requestData).then(response => {
        res(response)
      }).catch(err => {
        rej(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}