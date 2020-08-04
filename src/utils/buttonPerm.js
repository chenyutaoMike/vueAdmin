import store from "@/store";
import Vue from 'vue';
// 自定义指令
Vue.directive("btnPerm", {
  bind: function (el, bingind, vnode) {
    // 父级未渲染
    if(!bingind.def.hansBtnPerm(bingind.value)){
      el.style.display = 'none';
      
    }
   
  },
  inserted: function () {
    // 操作父节点
  },
  update: function () {

  },
  componentUpdated: function () {

  },
  unbind: function () {

  },
  hansBtnPerm: function (parmission) {
    let button = store.getters['app/buttonPermission'];
    let admin = store.getters['app/roles'];
    if(admin.includes('admin')) return true;  //如果是管理员，直接返回true
    return button.indexOf(parmission) !== -1 ? true : false;
  }
})