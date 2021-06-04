import MyTable from './MyTable.vue'

const MyTableInstall = {
  install: function(Vue) {
    Vue.component('MyTable', MyTable)
  }
}
//Automatic installation in the global case
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyTableInstall)
}
export default MyTableInstall

