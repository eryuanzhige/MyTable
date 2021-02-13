import MyTable from './MyTable.vue'

const MyTableInstall = {
  install: function(Vue) {
    Vue.component('MyTable', MyTable)
  }
}
// global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyTableInstall)
}
export default MyTableInstall

