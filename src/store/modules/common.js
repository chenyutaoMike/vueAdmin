import {GetCategory} from '@/api/news'
const state = {
  qiniuUrl:'http://qdrrb0mqw.bkt.clouddn.com/'
}
const actions = {
  getInfoCategory(context, requestData) {
    return new Promise((res, rej) => {
      // 接口
      GetCategory({}).then(response => {
        res(response)
      }).catch(err => {
        rej(err)
      })
    })
  }
}
const getters = {
  qiniuUrl : state => state.qiniuUrl
}
export default {
  namespaced: true,
  state,
  getters
}