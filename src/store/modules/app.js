
import { Login, Logout } from "@/api/login.js";
import { setToken, setUserName, getUserName, removeToken, removeUserName } from '@/utils/app';

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
  to_ken: '',
  user_name: getUserName() || '',
  roles: [],
  buttonPermission: []
}
const mutations = {
  SET_ISCOLLAPSE(state) {

    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
  },
  SET_TOKEN(state, value) {

    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.user_name = value;
  },
  SET_ROLES(state, value) {
    state.roles = value;
    console.log(state.roles)
  },
  SET_BUTTON(state, value) {
    state.buttonPermission = value;

  }
}
const getters = {
  isCollapse: state => state.isCollapse,
  roles: state => state.roles,
  buttonPermission: state => state.buttonPermission
}
const actions = {
  login({ commit }, requestData) {

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
  logout({ commit }) {
    return new Promise((res, rej) => {
      Logout().then(response => {

        console.log('gg思密达')
        removeToken()
        removeUserName()
        commit('SET_TOKEN', '')
        commit('SET_USERNAME', '')
        commit('SET_ROLES', [])
        res(response.data)


      })

    })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}