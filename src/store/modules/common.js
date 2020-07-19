import {GetCategory} from '@/api/news'
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

export default {
  namespaced: true
}