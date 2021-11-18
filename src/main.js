import Vue from 'vue'
import './plugins/elementui'
import BaseLayout from '../src/layout'
import router from './router'
import store from './store'
import '@/assets/styles/style/theme/index.css'
import '@/assets/styles/airport.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/coverElement.scss'
import '@/assets/iconfont/iconFont.css'
import '@/assets/font/font.scss'
import csscommon from '@/utils/csscommon'
import permission from './directive/permission'
import '@/utils/dialog'
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/firefly";
import App from './App.vue'
import Pagination from "@/components/Pagination";
import echarts from 'echarts' //引入echarts
import VueClipboard from 'vue-clipboard2'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import JsonExcel from 'vue-json-excel'


Vue.prototype.$echarts = echarts //引入组件
Vue.config.productionTip = false
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.csscommon = csscommon



Vue.prototype.msgSuccess = function (msg) {
  this.$message({  message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({  message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}
Vue.prototype.carSteps = function (msg) {
    console.log('可以用' );
    console.log(msg);
}

Vue.component('base-layout', BaseLayout)
Vue.component('Pagination', Pagination)
Vue.component('Treeselect', Treeselect)
Vue.component('downloadExcel', JsonExcel)

Vue.use(permission)
Vue.use(csscommon)
Vue.use(VueClipboard)

new Vue({
  render: h => h(App), 
  store,
  router,
}).$mount('#app')
