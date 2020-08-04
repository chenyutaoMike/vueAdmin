import Vue from "vue";
import vueCompositionApi from '@vue/composition-api';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/icons';  //引入自定义组件
import './router/premit';
// 自定义按钮权限 (自定义指令)
import './utils/buttonPerm';
// 引入按钮权限
import { buttonPermission } from '@/utils/buttonPermission';
Vue.prototype.btnPerm = buttonPermission;
// 自定义全局方法
// import global from '@/utils/global';



// Vue.use(global)
Vue.use(ElementUI)
Vue.use(vueCompositionApi)

Vue.config.productionTip = false;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
