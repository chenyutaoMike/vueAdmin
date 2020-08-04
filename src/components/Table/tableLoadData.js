import { reactive } from '@vue/composition-api';
import { requestUrl } from "@/api/requestUrl";
import { loadTableData } from "@/api/common";
export function loadData() {
  const tableData = reactive({
    item: [],
    total: 0
  })
  const tableLoadData = (params) => {

    let requestData = {
      url: requestUrl[params.url],
      method: params.method,
      data: params.data
    };
    loadTableData(requestData)
      .then(res => {
        console.log(res)
        let result = res.data;
        if (result.resCode === 0) {
          tableData.item = result.data.data;
          tableData.total = result.data.data.length === 0 ? 0 : result.data.total;
        }
      })
      .catch(err => { });
  }
  return {
    tableData,
    tableLoadData
  }
}