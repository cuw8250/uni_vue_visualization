import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import api from './common/api.js'//全局接口变量
import { uniAjax, debounce, throttle } from './common/utils.js'//全局常用变量
Vue.prototype.api = api;
Vue.prototype.uniAjax = uniAjax;
Vue.prototype.debounce = debounce;
Vue.prototype.throttle = throttle;

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp () {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif