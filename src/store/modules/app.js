
import { Login } from "@/api/login.js";
import { setToken, setUserName, getUserName, removeToken, removeUserName } from '@/utils/app';

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
  to_ken: '',
  user_name: getUserName() || ''
}
const mutations = {
  SET_ISCOLLAPSE(state) {
    console.log('app')
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
  },
  SET_TOKEN(state, value) {
    console.log('state')
    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.user_name = value;
  }
}
const getters = {
  isCollapse: state.isCollapse
}
const actions = {
  login({ commit }, requestData) {
    console.log('login')
    return new Promise((res, rej) => {
      // 接口
      Login(requestData).then(response => {
        let data = response.data.data;
        const { token, username } = data;
        commit('SET_TOKEN', token)
        commit('SET_USERNAME', username)
        setToken(token)
        setUserName(username)
        res(response)
      }).catch(err => {
        rej(err)
      })
    })
  },
  exit({ commit }) {
    return new Promise((res, rej) => {
      removeToken()
      removeUserName()
      commit('SET_TOKEN', '')
      commit('SET_USERNAME', '')
      res()
    })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}