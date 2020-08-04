import { reactive } from '@vue/composition-api';
export function paginationHook() {
  const pageData = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 50,
    pageSizes:[10, 20, 50, 100]
  })
  // 设置统计数据
  const setTotalCount = (val) =>{
    pageData.total = val;
  }
  const handleSizeChange = (val) => {
    pageData.pageSize = val;
  }
  const handleCurrentChange = (val) => {
    pageData.currentPage = val;
  }
  return {
    pageData,
    handleSizeChange,
    handleCurrentChange,
    setTotalCount
  }
}