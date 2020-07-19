import { MessageBox, Message } from 'element-ui';
export default {
  install(Vue, options) {
    Vue.prototype.confirm = (params) => {
      MessageBox.confirm(params.content, params.tip || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: params.type || 'warning',
        center: true
      }).then(() => {
        // 如果有回调函数，那么就执行这个函数
        params.fn && params.fn(params.id)
        Message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}