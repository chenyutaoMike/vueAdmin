const state = {
  id: '' || sessionStorage.getItem('infoId'),
  title: '' || sessionStorage.getItem('infoTitle')
}

const mutations = {
  UPDATE_STATE_VALUE(state, params) {
    for (let key in params) {
      state[key] = params[key].value;
      if (params[key].session) {
        sessionStorage.setItem(params[key].sessionKey, params[key].value)
      }
    }
  }
}
const getters = {
  infoId: (state) => state.id,
  infoTitle: (state) => state.title,

}
export default {
  namespaced: true,
  state,
  mutations,
  getters
}