import { MessageBox, Message } from 'element-ui';
import { ref } from '@vue/composition-api';
export function global() {
  const confirm = (params) => {
    MessageBox.confirm(params.content, params.tip || '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: params.type || 'warning',
      center: true
    }).then(() => {
      // 如果有回调函数，那么就执行这个函数
      
      params.fn && params.fn(params.id || '')

    }).catch(() => {
      params.catchFn && params.catchFn()
      Message({
        type: 'info',
        message: '已取消删除'
      });
    });

  }
  return {
    confirm
  }
}