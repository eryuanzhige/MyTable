import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import MyTable from './lib/index'
Vue.use(MyTable)
new Vue({
  el: '#app',
  render: h => h(App)
})
