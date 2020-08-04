
import store from '@/store/index';

export function buttonPermission(permission) {
  let button = store.getters['app/buttonPermission'];
  let admin = store.getters['app/roles'];
  if(admin.includes('admin')) return true;  //如果是管理员，直接返回true
  return button.indexOf(permission) !== -1 ? true : false;
}