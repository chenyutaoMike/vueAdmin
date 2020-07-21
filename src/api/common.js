import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from '@/utils/request';

export function common() {
  let categoryItem = reactive({
    item: []
  })
  /**
   * 
   * 获取分类 
   */
  const getInfoCategory = (params) => {
    GetCategory({}).then(res => {
      const result = res.data;
      if (result.resCode === 0) {
        const data = result.data.data;
        categoryItem.item = data;
      }

    }).catch(err => {

    })
  }
  /**
   * 
   * 获取全部分类 
   */
  const getInfoCategoryAll = (params) => {
    GetCategoryAll({}).then(res => {
      const result = res.data;
      if (result.resCode === 0) {
        const data = result.data;
        categoryItem.item = data;
      }

    }).catch(err => {

    })
  }

  return {
    getInfoCategory,
    categoryItem,
    getInfoCategoryAll
  }
}

/**
 * 获取七牛云token
 */
export function QiniuToKen(data){
  return service.request({
    method: 'post',
    url: '/uploadImgToken/',
    data: data
  })
}