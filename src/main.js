import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// Vue.component(Button.name, Button);
// Vue.component(Select.name, Select);
// Vue.component(Form.name, Form);

Vue.use(ElementUI)


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
